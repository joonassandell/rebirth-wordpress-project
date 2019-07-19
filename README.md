# Rebirth — WordPress Development Environment

This is a modern WordPress stack designed to work with [Rebirth](https://github.com/joonasy/rebirth) that helps you get started with the best development tools and project structure.

## Features

- Easy WordPress configuration with environment specific files
- Environment variables with [Dotenv](https://github.com/vlucas/phpdotenv) & [dotenv](https://github.com/motdotla/dotenv#readme) for deployments
- Better folder structure
- Uses composer for installing plugins. Includes useful plugins out of the box.
- Automatic WordPress installation to remote location
- Scripts for deploying databases and assets to remote locations
- Scripts for pulling assets and databases from remote locations

## Requirements

- GNU/Linux/Unix with Docker ([Docker toolbox](https://www.docker.com/products/docker-toolbox), [Vagrant](https://www.vagrantup.com/downloads.html) VM with Docker, [native Linux with Docker](http://docs.docker.com/linux/step_one/) or [Docker for Mac](https://docs.docker.com/docker-for-mac/)).
- [docker-compose](https://github.com/docker/compose)
- [Node.js](http://nodejs.org/)
- [Yarn](https://yarnpkg.com)

## Quick start

Quickly install with [create-project](https://github.com/mafintosh/create-project). Add your values to the following one-liner:

```
$ npx create-project my-project-dir-dev joonasy/rebirth-wordpress-dev --human-name="My Project" --theme-dir=my-theme-dir --author=joonasy --production-domain=my-project.com --wpml-user-id="=8365..." --wpml-key="=gxNTN8dHlwZ..." --acf-key="=9wZXJ8ZGF0..."
```

After the installation is done jump to phase 3 in the next section.

## Getting started

This development template assumes that you are using [Rebirth](https://github.com/joonasy/rebirth) to develop your theme. However it is not required and you may use any theme you like.

**1. Clone this git repository and create your project folder**

    $ git clone https://github.com/joonasy/rebirth-wordpress-dev.git my-project-dir-dev

**2. Replace all of the following variables in all the project files with _machine readable format_**

- `{{name}}`: This is your project name (e.g. `my-project-dir-dev`; It's recommended to use same name as your project folders name which you created above. This should also be used for git urls).
- `{{human-name}}`: This is your project human readable name (e.g. `My Project`).
- `{{theme-dir}}`: This will be your theme directory which will be generated later (e.g. `my-theme-dir`)
- `{{author}}`: Author of this project (e.g. `joonasy`)
- `{{production-domain}}`: Website url of the project in which the app will be published (e.g. `project-name.com`, _Don't add protocol or trailing slashes_.)
- `{{wpml-user-id}}` WPML user id. (e.g. `=8365`, _Note that you need to add the `=` sign in front here and in the following variables_)
- `{{wpml-key}}` WPML subscription key (e.g. `=gxNTN8dHlwZ...`)
- `{{acf-key}}` ACF subscription key (e.g. `=9wZXJ8ZGF0...`)

By default this template requires [WPML](http://wpml.org) and [ACF](https://www.advancedcustomfields.com) so you need to have those plugins purchased. ACF subscription key can be found from [advancedcustomfields.com/my-account](https://www.advancedcustomfields.com/my-account) and WPML user id and subscription key can be found from the download urls in [wpml.org/account/downloads/?user_id=YOUR_USER_ID&subscription_key=YOUR_KEY](https://wpml.org/account/downloads/). _If you don't need these plugins remove them from the [web/composer.json](web/composer.json)_.

**3. Install theme with Rebirth Yeoman generator**

If you don't want to use Rebirth you can skip this step and create your theme in some other way.

1. Navigate to `web/wp-content/themes/`
2. Create your theme with [Rebirth Yeoman Generator](https://github.com/joonasy/generator-rebirth)

```
$ yarn global add yo && yarn global add generator-rebirth@beta
$ yo rebirth {{theme-dir}} --project=wordpress
```

**4. Install all the dependencies and kickstart the project**

1. Copy `.env.example` to `.env` and setup your environment variables
2. Start docker and run:

```
$ make start
```

Crab a cup of :coffee: as the installation process may take a while. If you are not able to run these please refer to the [Makefile](Makefile) and run the commands manually.

After the installation is done, navigate to [PROJECT.md](PROJECT.md) to learn about further installation process and available commands.

**5. Recommended actions**

1. Make sure `PROJECT.md` contains correct information such as correct remote git links
2. Delete the following files
   - This `README.md`
   - Rename `PROJECT.md` to `README.md`
   - `CHANGELOG.md`
   - `.git` folder
3. Git init your fresh new project and remember to init your theme as well

Happy developing!

## Changelog

See [CHANGELOG.md](/CHANGELOG.md)

## Notes

### About plugins

- If you're using caching or optimization plugins such as [Autoptimize](https://wordpress.org/plugins/autoptimize/) or [W3 Total Cache](https://wordpress.org/plugins/w3-total-cache/) you should disable locally because they might create issues with CORS, BrowserSync etc. Most of the time caching isn't necessary while developing anyways.

### Why is `web/wp-content/themes` ignored?

By default `web/wp-content/themes` is ignored by git because we don't want this development repository to track theme related changes nor we want to use submodules. This is recommended practice since things may get messy if we have multiple themes in a single project. If for some reason you want to track these changes, remove `web/wp-content/themes/*` from `.gitignore`.

### Why using `wordpress:php*-apache` docker image if installing WordPress w/ composer?

Because the official image includes all the basics WordPress requires. Image could very well be `php:*-apache` etc. as well.

### I cannot clone a private bitbucket repository w/ composer

This could be an issue with [OSX users](https://github.com/docker/for-mac/issues/410). The easiest way to solve this is to use bitbuckets "App Password" [solution](https://stackoverflow.com/questions/23391839/clone-private-git-repo-with-dockerfile):

1. Go to your App Password settings: `Bitbucket settings -> Access Management -> App Password`
2. Create a password and give it all the permissions. Copy password to your own personal secure location.
3. In `composer.json` replace your private repository url to include your credentials `https://username:app_password@bitbucket.org/author/repository.git`

**Do not commit the above changes** just use it temporarily to get the repository.

### How to setup a [multisite network](https://wordpress.org/support/article/before-you-create-a-network/)

Following instructions setup WPMS to use blogs in sub folders.

1. Read [Before You Create A Network](https://wordpress.org/support/article/before-you-create-a-network/)
2. Add the following lines to `wp-config.php:~91` and make sure they're set correctly:

```
/**
 * Setup multisite
 */
define('WP_ALLOW_MULTISITE', true);
define('MULTISITE', true);
define('SUBDOMAIN_INSTALL', false);
define('DOMAIN_CURRENT_SITE', getenv('WORDPRESS_ENV') == 'development' ? getenv('DEVELOPMENT_DOMAIN') : '{{production-domain}}');
define('PATH_CURRENT_SITE', getenv('WORDPRESS_ENV') == 'development' ? '/' : '/');
define('SITE_ID_CURRENT_SITE', 1);
define('BLOG_ID_CURRENT_SITE', 1);
```

3. Add/replace the following to your `.htaccess`:

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

4. Change `DEVELOPMENT_DOMAIN=127.0.0.1:8000` to `DEVELOPMENT_DOMAIN=127.0.0.1`. E.g. make sure you [_don't_ have port in the dev url](https://wordpress.org/support/article/before-you-create-a-network/#restrictions).

### In production my WordPress home is located in a subdir (e.g. https://{{production-domain}}/myhome). How to make it work?

1. In wp-config.php
   - Change `define('WP_SITEURL', 'https://{{production-domain}}/wp');` to `define('WP_SITEURL', 'https://{{production-domain}}/myhome/wp');`
   - Change `define('WP_CONTENT_URL', 'https://' . $_SERVER['HTTP_HOST'] . '/wp-content');` to `define('WP_CONTENT_URL', 'https://' . $_SERVER['HTTP_HOST'] . '/myhome/wp-content');`
   - Change `define('ABSPATH', dirname( __FILE__ ) . '/wp/');` to `define('ABSPATH', dirname( __FILE__ ) . '/myhome/wp/');`
   - If using WPMS change `define('PATH_CURRENT_SITE', getenv('WORDPRESS_ENV') == 'development' ? '/' : '/');` to `define('PATH_CURRENT_SITE', getenv('WORDPRESS_ENV') == 'development' ? '/' : '/myhome/');`
2. I .env add your home dir to `PRODUCTION_WP_HOME` (e.g. `PRODUCTION_WP_HOME=/myhome`) so that replacing databases works correctly
3. In .htaccess make sure rewritebase is `RewriteBase /my-home` (not needed in WPMS)
