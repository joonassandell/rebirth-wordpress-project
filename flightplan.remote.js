require('dotenv').config()
const plan = require('flightplan')
const cfg = require('./flightplan.config')


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
let sshUser, sshPort, sshHost, webRoot, url, dbName, dbUser, dbPw;
const date = new Date().getTime();
const tmpDir = `wp-update-${date}`;

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
  url = plan.runtime.options.url;
  dbName = plan.runtime.options.dbName;
  dbUser = plan.runtime.options.dbUser;
  dbPw = plan.runtime.options.dbPw;
});


/* ======
 * Install WordPress
 * ====== */

plan.remote(['start', 'update'], remote => {
  remote.exec(`mkdir -p ${webRoot}tmp/wp-deployments`, { silent: true, failsafe: true });
});

plan.local(['start', 'update'], local => {
  const filesToCopy = [
    'web/.htaccess.example',
    'web/index.php',
    'web/wp-content/mu-plugins/register-theme-directory.php',
    'web/wp-config.php',
    'web/composer.json',
    'web/auth.json'
  ]

  local.log('Transferring local files ready for remote installation...');
  local.transfer(filesToCopy, `${webRoot}tmp/wp-deployments/${tmpDir}/`, { failsafe: true });
});

plan.remote(['start', 'update'], remote => {
  remote.log('Installing Composer...');
  remote.exec(`curl -sS https://getcomposer.org/installer | php && mv composer.phar ${webRoot}`);

  remote.log('Copying files...');
  const deploymentPath = `${webRoot}tmp/wp-deployments/${tmpDir}/`;

  remote.exec(`cp ${deploymentPath}wp/composer.json ${webRoot}`);

  if (plan.runtime.task === 'start') {
    remote.exec(`cp ${deploymentPath}wp/.htaccess.example ${webRoot}.htaccess`);
    remote.exec(`cp ${deploymentPath}wp/index.php ${webRoot}`);
    remote.exec(`mkdir -p ${webRoot}wp-content/mu-plugins/`, { silent: true, failsafe: true });
    remote.exec(`cp ${deploymentPath}wp/wp-content/mu-plugins/register-theme-directory.php \
      ${webRoot}wp-content/mu-plugins/`);
    remote.exec(`cp ${deploymentPath}wp/wp-config.php ${webRoot}`);
  }

  remote.log('Installing Composer dependencies...');
  remote.exec(`mkdir ${webRoot}vendor`, { failsafe: true });
  remote.with(`cd ${webRoot}`, () => { remote.exec(`php composer.phar update --no-dev`)});

  remote.log('Removing uploaded files...');
  remote.exec(`rm -r ${webRoot}composer.json`, { failsafe: true });
  remote.exec(`rm -r ${deploymentPath}`);
});


/* ======
 * Push Assets
 * ====== */

 plan.local(['assets-push'], local => {
  local.log('Deploying uploads folder...');
  local.exec(`rsync -avz -e "ssh -p ${sshPort}" \
    wp/wp-content/uploads ${sshUser}@${sshHost}:${webRoot}wp-content`, { failsafe: true });
 });


/* ======
 * Replace Database
 * ====== */

plan.local(['db-replace'], local => {
  local.log('Creating local database dump...');
  local.exec(`mkdir -p database/local`, { silent: true, failsafe: true });
  local.exec(`docker-compose exec db bash -c "mysqldump -uroot -proot \
    wordpress > database/local/wordpress-${date}.sql"`);

  local.log('Pushing local database dump to remote...');
  local.transfer([
    `database/migrate.remote.txt`,
    `database/local/wordpress-${date}.sql`
  ], `${webRoot}tmp`);
});

plan.remote(['db-replace'], remote => {
  remote.log('Backing up remote database...');
  remote.exec(`mkdir -p ${webRoot}tmp/database/remote`, { failsafe: true });
  remote.exec(`cp ${webRoot}tmp/database/migrate.remote.txt ${webRoot}`);
  remote.exec(`mysqldump -u${dbUser} -p${dbPw} -f ${dbName} > \
    ${webRoot}tmp/database/remote/wordpress-${date}.sql;`);

  remote.log('Dropping remote database...');
  remote.exec(`mysql -u${dbUser} -p${dbPw} -e 'drop database ${dbName};'`, { failsafe: true });

  remote.log('Replacing remote database...');
  remote.exec(`
    mysql -u${dbUser} -p${dbPw} \
      -e ' \
        create database ${dbName}; use ${dbName}; \
        source ${webRoot}tmp/database/local/wordpress-${date}.sql; \
        set @DEVELOPMENT_URL="${process.env.DEVELOPMENT_URL}"; \
        set @DEVELOPMENT_SITE_URL="${process.env.DEVELOPMENT_URL}/wp"; \
        set @REMOTE_URL="${url}"; \
        set @REMOTE_SITE_URL="${url}/wp"; \
        source ${webRoot}migrate.remote.txt;'
  `, { failsafe: true });

  remote.log('Removing transferred material from remote...');
  remote.exec(`rm ${webRoot}migrate.remote.txt`, { silent: true, failsafe: true });
  remote.exec(`rm -r ${webRoot}tmp/database/local`, { silent: true, failsafe: true });
});
