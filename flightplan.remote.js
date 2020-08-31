require('dotenv').config();
const plan = require('flightplan');
const cfg = require('./flightplan.config');


/* ======
 * Config
 * ====== */

/**
 * Target servers
 */
plan.target('production', cfg.production, cfg.production.opts);
plan.target('production-db', cfg.productionDB, cfg.productionDB.opts);

/**
 * Setup folders etc. ready for files
 */
let sshUser, sshPort, sshHost, webRoot, url, domain, wpHome, dbName, dbUser, dbPw;
const date = new Date().getTime();
const devDomain = process.env.DEVELOPMENT_URL.replace(/(^\w+:|^)\/\//, '');
const tmpDir = `wp-update-${date}`

plan.local('start', local => {
  const input = local.prompt('Are you sure you want to continue with the process? [y/n]');

  if (input.indexOf('y') === -1) {
    plan.abort('Plan canceled.')
  }
});

plan.local(['start', 'update', 'assets-push', 'db-replace'], local => {
  sshHost = plan.runtime.hosts[0].host;
  sshUser = plan.runtime.hosts[0].username;
  sshPort = plan.runtime.hosts[0].port;
  webRoot = plan.runtime.options.webRoot;
  wpHome = plan.runtime.options.wpHome === '/' ? plan.runtime.options.wpHome = '' : plan.runtime.options.wpHome || '';
  url = plan.runtime.options.url;
  domain = url ? url.replace(/(^\w+:|^)\/\//, '') : '';
  dbName = plan.runtime.options.dbName;
  dbUser = plan.runtime.options.dbUser;
  dbPw = plan.runtime.options.dbPw;
});


/* ======
 * Install WordPress
 * ====== */

plan.remote(['start', 'update'], remote => {
  remote.exec(`mkdir -p ${webRoot}/tmp/wp-deployments`, { silent: true, failsafe: true });
});

plan.local(['start', 'update'], local => {
  const filesToCopy = [
    'web/.htaccess.example',
    'web/index.php',
    'web/wp-content/mu-plugins/register-theme-directory.php',
    'web/wp-config.php',
    'web/composer.json'
  ]

  local.log(`Transferring local files to ${webRoot}/tmp/wp-deployments/${tmpDir}/`);
  local.transfer(filesToCopy, `${webRoot}/tmp/wp-deployments/${tmpDir}/`, { failsafe: true });
});

plan.remote(['start', 'update'], remote => {
  remote.log('Installing Composer...');
  remote.exec(`curl -sS https://getcomposer.org/installer | php && mv composer.phar ${webRoot}/`);

  remote.log('Copying files...');
  const deploymentPath = `${webRoot}/tmp/wp-deployments/${tmpDir}/web`;

  remote.exec(`cp ${deploymentPath}/composer.json ${webRoot}/`);

  if (plan.runtime.task === 'start') {
    remote.exec(`cp ${deploymentPath}/.htaccess.example ${webRoot}/.htaccess`);
    remote.exec(`cp ${deploymentPath}/index.php ${webRoot}/`);
    remote.exec(`mkdir -p ${webRoot}/wp-content/mu-plugins/`, { silent: true, failsafe: true });
    remote.exec(`cp ${deploymentPath}/wp-content/mu-plugins/register-theme-directory.php \
      ${webRoot}/wp-content/mu-plugins/`);
    remote.exec(`cp ${deploymentPath}/wp-config.php ${webRoot}/`);
  }

  remote.log('Installing Composer dependencies...');
  remote.exec(`mkdir ${webRoot}/vendor`, { failsafe: true });
  remote.with(`cd ${webRoot}/`, { failsafe: true }, () => { remote.exec(`
    php composer.phar clearcache &&
    php composer.phar update --prefer-dist --no-dev --optimize-autoloader --no-interaction
  `)});

  remote.log(`Removing uploaded files from ${webRoot} & ${deploymentPath}/`);
  remote.exec(`rm -r ${webRoot}/composer.json`, { failsafe: true });
  remote.exec(`rm -r ${webRoot}/composer.lock`, { failsafe: true });
  remote.exec(`rm -r ${deploymentPath}/`);
});


/* ======
 * Push Assets
 * ====== */

 plan.local(['assets-push'], local => {
  local.log('Deploying uploads folder...');
  local.exec(`rsync -avz -e "ssh -p ${sshPort}" \
    web/wp-content/uploads ${sshUser}@${sshHost}:${webRoot}/wp-content`, { failsafe: true });
 });


/* ======
 * Replace Database
 * ====== */

plan.local(['db-replace'], local => {
  local.log('Creating local database dump...');
  local.exec(`mkdir -p database/local`, { silent: true, failsafe: true });
  local.exec(`docker-compose exec -T db bash -c "mysqldump -uroot -proot \
    wordpress > docker-entrypoint-initdb.d/local/wordpress-${date}.sql"`);

  local.log('Pushing local database dump to remote...');
  local.transfer([
    `database/local/wordpress-${date}.sql`
  ], `${webRoot}/tmp`);
});

plan.remote(['db-replace'], remote => {
  remote.log(`Backing up remote database to ${webRoot}/tmp/database/remote/wordpress-${date}.sql`);
  remote.exec(`mkdir -p ${webRoot}/tmp/database/remote`, { failsafe: true });
  remote.exec(`mysqldump -u${dbUser} -p${dbPw} -f ${dbName} > \
    ${webRoot}/tmp/database/remote/wordpress-${date}.sql;`, { failsafe: true });

  remote.log(`Dropping remote database ${dbName}`);
  remote.exec(`mysql -u${dbUser} -p${dbPw} -e 'drop database ${dbName};'`, { failsafe: true });

  remote.log(`Replacing remote database with ${webRoot}/tmp/database/local/wordpress-${date}.sql`);
  remote.exec(`
    mysql -u${dbUser} -p${dbPw} \
      -e ' \
        create database ${dbName}; use ${dbName}; \
        source ${webRoot}/tmp/database/local/wordpress-${date}.sql;'
  `, { failsafe: true });

  remote.log('Installing WP-CLI & replacing strings in database...');
  remote.exec(`
    if [ ! -f ${webRoot}/wp-cli.phar ]; then
      curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar &&
      mv wp-cli.phar ${webRoot}
    fi

    if $(cd ${webRoot} && php wp-cli.phar --url=${url} core is-installed --network);
      then
        cd ${webRoot}
        php wp-cli.phar search-replace --url=${process.env.DEVELOPMENT_URL} '${process.env.DEVELOPMENT_URL}' '${url}${wpHome}' --network --skip-tables=wp_users,wp_blogs,wp_site
        php wp-cli.phar search-replace '${devDomain}' '${domain}' wp_blogs wp_site --network
        php wp-cli.phar search-replace '^\/' '${wpHome}\/' wp_blogs --regex --network
      else
        cd ${webRoot}
        php wp-cli.phar search-replace '${process.env.DEVELOPMENT_URL}' '${url}${wpHome}' --skip-tables=wp_users
    fi
  `, { failsafe: true });

  remote.log('Removing transferred material from remote...');
  remote.exec(`rm -r ${webRoot}/tmp/database/local`, { silent: true, failsafe: true });
});
