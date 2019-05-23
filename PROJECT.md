# {{human-name}} - Development environment

> Docker development environment for {{human-name}}. Started with [rebirth-wordpress-dev](https://github.com/joonasy/rebirth-wordpress-dev.git). 

# Requirements

* GNU/Linux/Unix with Docker ([Docker toolbox](https://www.docker.com/products/docker-toolbox), [Vagrant](https://www.vagrantup.com/downloads.html) VM with Docker, [native Linux with Docker](http://docs.docker.com/linux/step_one/) or [Docker for Mac](https://docs.docker.com/docker-for-mac/)).
* [docker-compose](https://github.com/docker/compose)
* [Node.js](http://nodejs.org/)
* [Yarn](https://yarnpkg.com)
* SSH access (RSA Key Pair) and [rsync](https://linux.die.net/man/1/rsync) (Optional but required for syncing assets and databases)

# Installation 

**1. Clone this repository and the theme repository**

```
$ git clone git@bitbucket.org:{{author}}/{{name}}.git
$ git clone git@bitbucket.org:{{author}}/{{theme-dir}}.git {{name}}/web/wp-content/themes/{{theme-dir}}
```

**2. Prepare for installation**

1. Copy [`.env.example`](.env.example) to `.env` file and set your environment variables. Most of the vars should already be set by the creator of the project. Especially make sure that all the `PRODUCTION_*` vars are set (e.g `PRODUCTION_PASSWORD`). 

2. Start docker

**3. Install**

1. Clone production environment to your local development environment (Requires SSH access and production server credentials):

```
$ make start-clone
```

2. Or kickstart your project:

```
$ make start
```

Crab a cup of :coffee: as the installation process may take a while. If you are not able to run these please refer to the [Makefile](Makefile) and run the commands manually.

**4. Navigate to [127.0.0.1:8000](http://127.0.0.1:8000) and setup WordPress**

Login to WordPress, activate plugins and theme if you kickstarted the project, otherwise just login to WordPress with the production credentials and verify everything works properly. 

**5. Start theme development**

Go to `web/wp-content/themes/{{theme-dir}}` to learn about the theme development and deployment. 

# Usage

All the commands are near equivalents to `$ docker` / `$ docker-compose` commands and `$ yarn ...` scripts. If you are not able to run these please refer to the [Makefile](Makefile), [package.json](package.json), [Docker compose reference](https://docs.docker.com/compose/reference) and [Docker CLI](https://docs.docker.com/engine/reference/commandline/). 

## Local commands

These commands are for setting up your local development environment.

#### `$ make start`

Kickstart your project from scratch. Builds, creates and starts Docker containers, creates fresh database and updates all dependencies. 

#### `$ make start-clone`

Clone production environment to your local development environment. Builds, creates and starts Docker containers, updates all dependencies, pulls assets, pulls MySQL dump, replaces local database with the remote database. Make sure database server credentials are set in the `.env` file.

#### `$ make up`

Starts Docker containers. Use this to resume developing after installing the project. 

#### `$ make stop`

Stop Docker containers.

#### `$ make update`

Update dependencies (Yarn, Composer).

#### `$ make rebuild`

Rebuilds and reinstall containers, including your MySQL container (Note that you will lose your current data).

#### `$ make web-bash`

Connect to WordPress (`web`) container.

#### `$ make db-bash`

Connect to MySQL (`db`) container.

#### `$ make assets-pull`

Pull uploaded files from production environment (`uploads/`  folder etc.) to your local environment.

#### `$ make db-pull`

Create and pull MySQL dump from the production environment to `database/remote` folder, backup current database to  `database/local` folder and place the pulled dump ready for importing/replacing (`database/wordpress.sql`). Make sure database server credentials are set in the `.env` file.

#### `$ make db-replace`

Backups current database and replaces it with `database/wordpress.sql` dump. 

#### `$ make db-replace-clone`

Shorcut for `$ make db-pull` & `$ make db-replace`.

## Remote commands

**:warning: Be extremely careful with the remote commands or you may break the server configuration! You need SSH access for the remote commands.** Make sure all the production server credentials are set in the `.env` file and [config.js](config.js) has the correct urls set in `opts`. 

#### `$ make production-start`

Install WordPress and plugins to the production server. This is most likely **required only once**, so be careful not to reinstall accidentally. 

You may want to:

* Deploy your theme first
* Add production database credentials and [unique keys and salts](https://api.wordpress.org/secret-key/1.1/salt/) temporarily in [`wp/wp-config.php`](wp/wp-config.php) so they can copied to the server (Do not commit)
* `$ make production-db-replace-clone`: Replace remote database with your local one. Make sure the database name matches with the remote in `.env` (`PRODUCTION_DB_NAME`).
* `$ make production-assets-push` to sync your local materials to the server

If you want to add new new server environments you need to modify [flightplan.remote.js](flightplan.remote.js), [flightplan.config.js](flightplan.config.js), [Makefile](Makefile), [package.json](package.json), [.env](.env) and [.env.example](.env.example) files. 

#### `$ make production-db-replace-clone`

Creates dump of your local database and replaces production database with the newly created dump. Runs SQL commands from the `database/migrate.remote.txt` file.

#### `$ make production-update`

Update WordPress Composer dependencies.

#### `$ make production-assets-push`

Push your local assets to the production server.

---

You may learn more about the project and issues in [Rebirth — WordPress Development Environment](https://github.com/joonasy/rebirth-wordpress-dev)
