# Rebirth — WordPress Development Environment

This is a modern WordPress stack designed to work with [Rebirth](https://github.com/joonassandell/rebirth) that helps you get started with the best development tools and project structure.

## Features

- Easy WordPress configuration with environment specific files with [Dotenv](https://github.com/vlucas/phpdotenv) & [dotenv](https://github.com/motdotla/dotenv#readme) for deployments
- Better folder structure
- Uses composer for installing plugins. Includes useful plugins out of the box.
- WordPress installation to remote location
- Scripts for deploying databases and assets to remote locations
- Scripts for pulling assets and databases from remote locations

## Requirements

- GNU/Linux/Unix with Docker ([Docker toolbox](https://www.docker.com/products/docker-toolbox), [Vagrant](https://www.vagrantup.com/downloads.html) VM with Docker, [native Linux with Docker](http://docs.docker.com/linux/step_one/) or [Docker for Mac](https://docs.docker.com/docker-for-mac/)).
- [docker-compose](https://github.com/docker/compose)
- [Node.js](http://nodejs.org/)
- [Npm](https://www.npmjs.com)
- [WPML](http://wpml.org) 
- [ACF](https://www.advancedcustomfields.com)

## Quick start

Quickly install with [create-project](https://github.com/mafintosh/create-project). Add your values to the following one-liner:

```
$ npx create-project my-project-dir joonassandell/rebirth-wordpress-project --human-name="My Project" --theme-dir=my-theme-dir --author=joonassandell --production-url=my-project.com --wpml-user-id="=8365..." --wpml-key="=..." --acf-key="=..."
```

After the installation is done jump to phase 3 in the next section.

## Getting started

This development template assumes that you are using [Rebirth](https://github.com/joonassandell/rebirth) to develop your theme. However it is not required and you may use any theme you like.

**1. Clone this git repository and create your project folder**

    $ git clone https://github.com/joonassandell/rebirth-wordpress-project.git my-project-dir

**2. Replace all of the following variables in all the project files with _machine readable format_**

- `{{name}}`: This is your project name (e.g. `my-project-dir`; It's recommended to use same name as your project folders name which you created above. This should also be used for git urls).
- `{{human-name}}`: This is your project human readable name (e.g. `My Project`).
- `{{theme-dir}}`: This will be your theme directory which will be generated later (e.g. `my-theme-dir`)
- `{{author}}`: Author of this project (e.g. `joonassandell`)
- `{{production-url}}`: Website url of the project in which the app will be published (e.g. `project-name.com`, _Don't add protocol or trailing slashes_.)
- `{{wpml-user-id}}` WPML user id. (e.g. `=8365`, _Note that you need to add the `=` sign in front here and in the following variables_)
- `{{wpml-key}}` WPML subscription key (e.g. `=gxNTN8dHlwZ...`)
- `{{acf-key}}` ACF subscription key (e.g. `=9wZXJ8ZGF0...`)

By default this template requires [WPML](http://wpml.org) and [ACF](https://www.advancedcustomfields.com) so you need to have those plugins purchased. ACF subscription key can be found from [advancedcustomfields.com/my-account](https://www.advancedcustomfields.com/my-account) and WPML user id and subscription key can be found from the download urls in [wpml.org/account/downloads/?user_id=YOUR_USER_ID&subscription_key=YOUR_KEY](https://wpml.org/account/downloads/). _If you don't need these plugins remove them from the [web/composer.json](web/composer.json)_.

**3. Install theme with Rebirth Yeoman generator**

If you don't want to use Rebirth you can skip this step and create your theme in some other way.

1. Navigate to `web/wp-content/themes/`
2. Create your theme with [Rebirth Yeoman Generator](https://github.com/joonassandell/generator-rebirth)

```
$ npm install yo -g && npm install generator-rebirth -g
$ yo rebirth {{theme-dir}} --project=wordpress
```

**4. Install all the dependencies and kickstart the project**

Start docker and run:

```
$ make start
```

Crab a cup of :coffee: as the installation process may take a while. If you are not able to run these please refer to the [Makefile](Makefile) and run the commands manually.

**5. Navigate to [127.0.0.1:8000/wp/wp-admin](http://127.0.0.1:8000/wp/wp-admin)**

Setup to WordPress, activate Advanced Custom Fields and theme if not already activated. 

**6. Clean up & recommended actions**

Run `$ make bootstrap`. Note that the script will remove this file and rename `PROJECT.MD` to `README.md`. See the new [README.md](README.md) to learn about further installation process, available commands and make sure it contains correct information such as remote git links.

Once you have added some data to your project you should create initial MySQL dump with `$ make db-commit` and commit the new dump (`database/wordpress.sql`) so that future/other developers have better starting point with the project.

Happy developing!

## Changelog

See [CHANGELOG.md](/CHANGELOG.md)

## Notes & FAQ

### About plugins

If you're using caching or optimization plugins such as [Autoptimize](https://wordpress.org/plugins/autoptimize/) or [W3 Total Cache](https://wordpress.org/plugins/w3-total-cache/) you should disable locally because they might create issues with CORS, BrowserSync etc. Most of the time caching isn't necessary while developing anyways.

### Should `web/wp-content/themes` be ignored?

By default `web/wp-content/themes` is not ignored by git because we want to keep things simple by keeping all the development material in the same repository. If you don't want this development repository to track theme related changes just add the following to `.gitignore` and remember to document on how to pull your theme.

```
web/wp-content/themes/*
!web/wp-content/themes/.gitkeep
```

### Should `database/wordpress.sql` be ignored?

Well maybe but it's easier for other developers to install the project in the future if they have some starting point. If you don't like this, just remove the `!database/wordpress.sql` from `.gitignore`.

### Why using `wordpress:php*-apache` docker image if installing WordPress w/ composer?

Because the official image includes all the basics WordPress requires. Image could very well be `php:*-apache` etc. as well.

### How to setup a [multisite network](https://wordpress.org/support/article/before-you-create-a-network/)

How to setup a multisite with [path-based](https://wordpress.org/support/article/before-you-create-a-network/#path-based) install. This guide assumes that the project contains a MySQL dump in `database/wordpress.sql`.

1. Read [Before You Create A Network](https://wordpress.org/support/article/before-you-create-a-network/)
2. Change all strings with `127.0.0.1:8000` to `127.0.0.1` and change `ports: 8000:80` to `ports: 80:80` in `docker-compose.yml`. E.g. make sure you [_don't_ have port in the dev url](https://wordpress.org/support/article/before-you-create-a-network/#restrictions)
3. Restart docker. Note that your new site is now located in [127.0.0.1](http://127.0.0.1)
4. Run `docker-compose exec web bash -c "wp search-replace '127.0.0.1:8000' '127.0.0.1' --allow-root --network"` to replace all the old strings in database
5. Run `docker-compose exec web bash -c "wp search-replace '127.0.0.1/wp' '127.0.0.1' wp_options --allow-root --network"` so that the site root is set correctly
6. Do steps [Allow Multisite](https://wordpress.org/support/article/create-a-network/#step-2-allow-multisite) and [Installing a Network](https://wordpress.org/support/article/create-a-network/#step-3-installing-a-network). Add the instructed line to `wp-config.php:~103`: 

```php
/**
 * Setup multisite
 */
define('WP_ALLOW_MULTISITE', true);
```

7. As instructed in step 6. make sure the following lines are in `wp-config.php:~103` & `wp-config.example.php:~103` with the correct domain:

```php
/**
 * Setup multisite
 */
define('WP_ALLOW_MULTISITE', true);
define('MULTISITE', true);
define('SUBDOMAIN_INSTALL', false);
define('DOMAIN_CURRENT_SITE', getenv('WORDPRESS_ENV') == 'development' ? '127.0.0.1' : 'example.com');
define('PATH_CURRENT_SITE', '/');
define('SITE_ID_CURRENT_SITE', 1);
define('BLOG_ID_CURRENT_SITE', 1);
```

8. As instructed in step 6. make sure the following lines are in `.htaccess` & `.htaccess.example`:

```
# ======
# WordPress
# ======

# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]

# add a trailing slash to /wp-admin
RewriteRule ^([_0-9a-zA-Z-]+/)?wp-admin$ $1wp-admin/ [R=301,L]

RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^([_0-9a-zA-Z-]+/)?(wp-(content|admin|includes).*) wp/$2 [L]
RewriteRule ^([_0-9a-zA-Z-]+/)?(.*\.php)$ wp/$2 [L]
RewriteRule . index.php [L]
</IfModule>
# END WordPress
```

9. Change `define('WP_SITEURL', getenv('DEVELOPMENT_URL') . '/wp');` -> `define('WP_SITEURL', getenv('DEVELOPMENT_URL'));` in in `wp-config.php` & `wp-config.example.php` to prevent confusion. 
10. Activate plugins you had to deactivate in step 6. 
11. At this time, in path-based installs you cannot remove the `/blog` slug without manual configuration to the network options in a non-obvious place. Make sure your permalinks are set as wanted with custom structure (e.g. `/articles/%postname%`) or you can [remove the `/blog`](https://isabelcastillo.com/remove-blog-slug-multisite) which is not recommended.
12. Update your database dump once you have created network and added sub blogs with `$ make db-commit`. Remember to commit all your changes.


### In production my WordPress home is located in a subdir (e.g. https://{{production-url}}/myhome). How to make it work?

1. In wp-config.php
   - Change `define('WP_SITEURL', 'https://{{production-url}}/wp');` to `define('WP_SITEURL', 'https://{{production-url}}/myhome/wp');`
   - Change `define('WP_CONTENT_URL', 'https://' . $_SERVER['HTTP_HOST'] . '/wp-content');` to `define('WP_CONTENT_URL', 'https://' . $_SERVER['HTTP_HOST'] . '/myhome/wp-content');`
   - Change `define('ABSPATH', dirname( __FILE__ ) . '/wp/');` to `define('ABSPATH', dirname( __FILE__ ) . '/myhome/wp/');`
   - If using WPMS change `define('PATH_CURRENT_SITE', getenv('WORDPRESS_ENV') == 'development' ? '/' : '/');` to `define('PATH_CURRENT_SITE', getenv('WORDPRESS_ENV') == 'development' ? '/' : '/myhome/');`
2. In .env add your home dir to `PRODUCTION_WP_HOME` (e.g. `PRODUCTION_WP_HOME=/myhome`) so that replacing databases works correctly
3. In .htaccess make sure rewritebase is `RewriteBase /myhome` (not needed in WPMS)

### I'm getting the error `the input device is not a TTY` 

Try to add `export COMPOSE_INTERACTIVE_NO_CLI=1` to your shell and if it works you should add it to your bash profile. [https://github.com/docker/compose/issues/5696](https://github.com/docker/compose/issues/5696) 

## License

Copyright (c) 2020 Joonas Sandell (Twitter: [@joonassandell](https://twitter.com/joonassandell)). Licensed under the MIT license.
