require('dotenv').config();
const plan = require('flightplan');
const cfg = require('./flightplan.config');


/* ======
 * Configuration
 * ====== */

/**
 * Target servers
 */
plan.target('local', {});
plan.target('production', cfg.production, cfg.production.opts);
plan.target('production-db', cfg.productionDB, cfg.productionDB.opts);

/**
 * Setup folders, prompts etc. ready for install
 */
let sshUser, sshPort, sshHost, webRoot, domain, wpHome, dbName, dbUser, dbPw;
let date = `${new Date().getTime()}`;

plan.local(['start', 'assets-pull', 'db-pull', 'db-replace'], (local) => {
  sshHost = plan.runtime.hosts[0].host;
  sshUser = plan.runtime.hosts[0].username;
  sshPort = plan.runtime.hosts[0].port;
  webRoot = plan.runtime.options.webRoot;
  domain = plan.runtime.options.domain;
  wpHome = plan.runtime.options.wpHome;
  dbName = plan.runtime.options.dbName;
  dbUser = plan.runtime.options.dbUser;
  dbPw = plan.runtime.options.dbPw;
});


/* ======
 * Start & update
 * ====== */

plan.local(['start'], (local) => {
  local.log('Installing dependencies...');
  local.exec(`
    if [ ! -f web/.htaccess ]
      then
        cp web/.htaccess.example web/.htaccess
    fi

    if [ ! -f web/wp-config.php ]
      then
        cp web/wp-config.example.php web/wp-config.php
    fi

    docker-compose up -d

    docker run --rm -v ${process.env.DEVELOPMENT_SSH_KEYS_PATH}:/root/.ssh \
      --volumes-from={{name}}-web \
      --workdir=/var/www/html/ composer/composer clearcache

    docker run --rm -v ${process.env.DEVELOPMENT_SSH_KEYS_PATH}:/root/.ssh \
    --volumes-from={{name}}-web \
    --workdir=/var/www/html/ composer/composer update
  `);
});


/* ======
 * Pull assets
 * ====== */

plan.local(['assets-pull'], (local) => {
  local.log('Downloading uploads folder...');
  local.exec(
    `rsync -avz -e 'ssh -p ${sshPort}' \
    ${sshUser}@${sshHost}:${webRoot}/wp-content/uploads web/wp-content`,
    { failsafe: true },
  );
});


/* ======
 * Backup database
 * ====== */

plan.local(['db-backup'], (local) => {
  local.log('Creating local backups...');
  local.exec(`mkdir -p database/local`, { silent: true, failsafe: true });
  local.exec(`docker-compose exec db bash -c 'mysqldump -uroot -proot \
      wordpress > /database/local/wordpress-${date}.sql'`, { failsafe: true });
});


/* ======
 * Pull database
 * ====== */

plan.remote(['db-pull'], (remote) => {
  remote.log('Creating remote database dump...');
  remote.exec(`mkdir -p ${webRoot}/tmp/database/remote`, {
    silent: true,
    failsafe: true,
  });
  remote.exec(
    `mysqldump -u${dbUser} -p${dbPw} ${dbName} > ${webRoot}/tmp/database/remote/${dbName}-${date}.sql`,
  );
});

plan.local(['db-pull'], (local) => {
  local.log('Pulling database...');
  local.exec(`mkdir -p database/remote`, { silent: true, failsafe: true });
  local.exec(`rsync -avz -e 'ssh -p ${sshPort}' \
    ${sshUser}@${sshHost}:${webRoot}/tmp/database/remote/${dbName}-${date}.sql ./database/remote`);
  local.exec(
    `cp ./database/remote/${dbName}-${date}.sql ./database/wordpress.sql`,
  );
});

plan.remote(['db-pull'], (remote) => {
  remote.log('Removing remote database dump...');
  remote.exec(`rm ${webRoot}/tmp/database/remote/${dbName}-${date}.sql`);
});


/* ======
 * Replace database
 * ====== */

plan.local(['db-replace'], (local) => {
  local.log('Replacing database...');

  local.exec(
    String.raw`
      if [ -f database/wordpress.sql ]
        then
          docker-compose exec db bash -c "mysql -uroot -proot \
            -e 'drop database wordpress;'"
      fi
  `,
    { failsafe: true },
  );

  local.exec(String.raw`
    if [ -f "database/wordpress.sql" ]
      then
        docker-compose exec db bash -c "mysql -uroot -proot \
          -e ' \
            create database wordpress; \
            use wordpress; source database/wordpress.sql;'"
    fi
  `);

  local.log('Replacing strings in database...');
  local.exec(String.raw`
    docker-compose exec web bash -c " \
      if \$(wp --url=${domain} core is-installed --network --allow-root);
        then
          wp search-replace --url=${domain} '${domain}${wpHome}' '${process.env.DEVELOPMENT_DOMAIN}' --network --allow-root --skip-columns=guid --skip-tables=wp_users,wp_blogs,wp_site
          wp search-replace --url=${domain} '${domain}' '${process.env.DEVELOPMENT_DOMAIN}' wp_blogs wp_site --allow-root --network
        else
          wp search-replace '${domain}${wpHome}' '${process.env.DEVELOPMENT_DOMAIN}' --skip-columns=guid --allow-root --skip-tables=wp_users
      fi
    "
  `, { failsafe: true });

});
