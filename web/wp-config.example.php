<?php
/* =======================================
 * The base configuration for WordPress
 * =======================================
 *
 * https://github.com/WordPress/WordPress/blob/master/wp-config-sample.php
 */

/**
 * Load database info and local development parameters
 */
switch (getenv('WORDPRESS_ENV')) {
	case "development": {
        define('DB_NAME', getenv('WORDPRESS_DB_NAME'));
        define('DB_USER', getenv('WORDPRESS_DB_USER'));
        define('DB_PASSWORD', getenv('WORDPRESS_DB_PASSWORD'));
        define('DB_HOST', 'db');

        define('WP_HOME', getenv('DEVELOPMENT_URL'));
        define('WP_SITEURL', getenv('DEVELOPMENT_URL') . '/wp');

        define('WP_CONTENT_DIR', dirname( __FILE__ ) . '/wp-content');
        define('WP_CONTENT_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/wp-content');

        define('SAVEQUERIES', true);
        define('WP_DEBUG', true);
        define('FS_METHOD', 'direct');
        
        break;
	}

	default: {
        define('DB_NAME', '');
        define('DB_USER', '');
        define('DB_PASSWORD', '');
        define('DB_HOST', 'localhost');

        define('WP_HOME', 'https://{{production-domain}}');
        define('WP_SITEURL', 'https://{{production-domain}}/wp');

        define('WP_CONTENT_DIR', dirname(__FILE__) . '/wp-content');
        define('WP_CONTENT_URL', 'https://' . $_SERVER['HTTP_HOST'] . '/wp-content');
        
        define('WP_DEBUG', true);
        define('WP_DEBUG_DISPLAY', false);
        define('WP_DEBUG_LOG', true);
        ini_set('display_errors', 0);
        
        break;
	}
}

/**
 * Database Charset to use in creating database tables.
 */
define('DB_CHARSET', 'utf8');

/**
 * The Database Collate type. Don't change this if in doubt
 */
define('DB_COLLATE', '');

/**
 * WP Rocket credentials
 */
if (!defined('WP_ROCKET_KEY')) {
	define('WP_ROCKET_KEY', '{{wp-rocket-key}}');
}

if (!defined('WP_ROCKET_EMAIL')) {
	define('WP_ROCKET_EMAIL', '{{wp-rocket-email}}');
}

/**
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'put your unique phrase here');
define('SECURE_AUTH_KEY',  'put your unique phrase here');
define('LOGGED_IN_KEY',    'put your unique phrase here');
define('NONCE_KEY',        'put your unique phrase here');
define('AUTH_SALT',        'put your unique phrase here');
define('SECURE_AUTH_SALT', 'put your unique phrase here');
define('LOGGED_IN_SALT',   'put your unique phrase here');
define('NONCE_SALT',       'put your unique phrase here');

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * Setup multisite
 */
// define('WP_ALLOW_MULTISITE', true);
// define('MULTISITE', true);
// define('SUBDOMAIN_INSTALL', false);
// define('DOMAIN_CURRENT_SITE', getenv('WORDPRESS_ENV') == 'development' ? getenv('DEVELOPMENT_URL') : '{{production-domain}}');
// define('PATH_CURRENT_SITE', getenv('WORDPRESS_ENV') == 'development' ? '/' : '/');
// define('SITE_ID_CURRENT_SITE', 1);
// define('BLOG_ID_CURRENT_SITE', 1);


/**
 * If we're behind a proxy server and using HTTPS, we need to alert Wordpress of that fact
 * see also http://codex.wordpress.org/Administration_Over_SSL#Using_a_Reverse_Proxy
 */
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}

/**
 * Absolute path to the WordPress directory.
 */
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname( __FILE__ ) . '/wp/');
}

/**
 * Sets up WordPress vars and included files. 
 */
require_once(ABSPATH . 'wp-settings.php');
