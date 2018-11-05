/* ========================================
 * Config
 * ======================================== */

const config = {
  production: {
    host: process.env.PROD_SSH_HOST,
    username: process.env.PROD_SSH_USER,
    port: process.env.PROD_SSH_PORT,
    agent: process.env.SSH_AUTH_SOCK,
    readyTimeout: 999999,
    opts: {
      webRoot: process.env.PROD_WEBROOT
    }
  },
  productionDB: {
    host: process.env.PROD_DB_SSH_HOST,
    username: process.env.PROD_DB_SSH_USER,
    port: process.env.PROD_DB_SSH_PORT,
    agent: process.env.SSH_AUTH_SOCK,
    readyTimeout: 999999,
    opts: {
      webRoot: process.env.PROD_DB_WEBROOT,
      url: process.env.PROD_URL,
      dbName: process.env.PROD_DB_NAME,
      dbUser: process.env.PROD_DB_USER,
      dbPw: process.env.PROD_DB_PASSWORD
    }
  }
};

module.exports = config;