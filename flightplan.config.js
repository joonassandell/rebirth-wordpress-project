/* =======================================
 * Config
 * ======================================= */

const config = {
  production: {
    host: process.env.PRODUCTION_SSH_HOST,
    username: process.env.PRODUCTION_SSH_USER,
    port: process.env.PRODUCTION_SSH_PORT,
    agent: process.env.SSH_AUTH_SOCK,
    readyTimeout: 999999,
    opts: {
      webRoot: process.env.PRODUCTION_WEBROOT
    }
  },
  productionDB: {
    host: process.env.PRODUCTION_DB_SSH_HOST,
    username: process.env.PRODUCTION_DB_SSH_USER,
    port: process.env.PRODUCTION_DB_SSH_PORT,
    agent: process.env.SSH_AUTH_SOCK,
    readyTimeout: 999999,
    opts: {
      webRoot: process.env.PRODUCTION_DB_WEBROOT,
      url: process.env.PRODUCTION_URL,
      wpHome: process.env.PRODUCTION_WP_HOME,
      dbName: process.env.PRODUCTION_DB_NAME,
      dbUser: process.env.PRODUCTION_DB_USER,
      dbPw: process.env.PRODUCTION_DB_PASSWORD
    }
  }
};

module.exports = config;