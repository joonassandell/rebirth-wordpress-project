# {{human-name}}

> Docker development environment for {{human-name}}. Started with [rebirth-wordpress-dev](https://github.com/joonassandell/rebirth-wordpress-dev.git).

# Requirements

- GNU/Linux/Unix with Docker ([Docker toolbox](https://www.docker.com/products/docker-toolbox), [Vagrant](https://www.vagrantup.com/downloads.html) VM with Docker, [native Linux with Docker](http://docs.docker.com/linux/step_one/) or [Docker for Mac](https://docs.docker.com/docker-for-mac/)).
- [docker-compose](https://github.com/docker/compose)
- [Node.js & Npm](http://nodejs.org/)
- [Composer](https://getcomposer.org/)
- SSH access (RSA Key Pair) and [rsync](https://linux.die.net/man/1/rsync) for syncing assets, repositories and databases

# Installation

**1. Clone this repository**

```
$ git clone git@bitbucket.org:{{author}}/{{name}}.git && cd {{name}}
```

**2. Prepare for installation**

1. Copy [`.env.example`](.env.example) to `.env` file and set your environment variables. Most of the vars should already be set by the creator of the project. Especially make sure that all the `PRODUCTION_*` vars are set (e.g `PRODUCTION_PASSWORD`).

2. If this project contains secret Git repositories, make sure you have SSH access to them.

3. Start Docker

**3. Install**

```
$ make start
```

Alternatively clone production environment to your local development environment with `$ make start-clone` **but note that this could be very heavy process, so do it with care**. If you are not able to run these commands please refer to the [Makefile](Makefile) and run the commands manually.

**4. Navigate to [127.0.0.1:8000](http://127.0.0.1:8000)**

Login to WordPress, activate plugins and themes if not already activated. Assets such as images are probably not working, so if you need them you can download them with `$ make assets-pull`.

**5. Start theme development**

Go to `web/wp-content/themes/{{theme-dir}}` to learn about the theme development and deployment.

# Usage

All the commands are near equivalents to `$ docker` / `$ docker-compose` commands and `$ npm ...` scripts. If you are not able to run these please refer to the [Makefile](Makefile), [package.json](package.json), [Docker compose reference](https://docs.docker.com/compose/reference) and [Docker CLI](https://docs.docker.com/engine/reference/commandline/).

## Local commands

These commands are for setting up your local development environment.

#### `$ make start`

Start your project. Builds, creates and starts Docker containers, imports database from `database/wordpress.sql` and installs all dependencies.

#### `$ make start-clone`

Clone production environment to your local development environment. Builds, creates and starts Docker containers, updates all dependencies, pulls assets, pulls MySQL dump, replaces local database with the remote database. Make sure database server credentials are set in the `.env` file. **Note that this could be very heavy process, so do it with care**

#### `$ make up`

Starts Docker containers. Use this to resume developing after installing the project.

#### `$ make stop`

Stop Docker containers.

#### `$ make update`

Update dependencies (Npm, Composer).

#### `$ make rebuild`

Rebuilds and reinstall containers, including your MySQL container. **Note that you will lose your current data**.

#### `$ make web-bash`

Connect to WordPress (`web`) container.

#### `$ make db-bash`

Connect to MySQL (`db`) container.

#### `$ make assets-pull`

Pull uploaded files from production environment (`uploads/` folder etc.) to your local environment.

#### `$ make db-backup`

Creates dump to `database/local/wordpress-xxx.sql` from your local database.

#### `$ make db-pull`

Create and pull MySQL dump from the production environment to `database/remote` folder and place the pulled dump ready for replacing in `/database/remote/wordpress.sql`. **Note that this could be very heavy process, so do it with care**.

#### `$ make db-replace`

Backups current database and replaces it with `database/remote/wordpress.sql` dump if there is one.

#### `$ make db-replace-clone`

Shorcut for `$ make db-pull` & `$ make db-replace`.

#### `$ make db-clean`
  
Cleans up dumps from `database/local` and `database/remote` to save disk space.

#### `$ make db-commit`

Creates dump to `database/wordpress.sql` from your local database. Idea here is to update database to git for other developers to use. Make sure everything works fine before doing this and then commit the new dump.

#### `$ make db-reset`

Reset your local database by replacing it with `database/wordpress.sql`.

#### `$ make replace-special-characters`

Replace common invalid characters in database with WP-CLI (`Ã¤` -> `ä` etc.).

#### `$ make regenerate-thumbnails`

Regenerate WordPress thumbnails with WP-CLI.

## Remote commands

**:warning: Be extremely careful with the remote commands or you may break the server configuration! You need SSH access for the remote commands.**

#### `$ make production-start`

Install WordPress and plugins to the production server. This is most likely required only once, so be careful not to reinstall accidentally.

You may want to:

- Deploy your theme first
- Add production database credentials and [unique keys and salts](https://api.wordpress.org/secret-key/1.1/salt/) temporarily in [`wp/wp-config.php`](wp/wp-config.php) so they can copied to the server (Do not commit)
- `$ make production-db-replace-clone`: Replace remote database with your local one. Make sure the database name matches with the remote in `.env` (`PRODUCTION_DB_NAME`).
- `$ make production-assets-push` to sync your local materials to the server

If you want to add new new server environments you need to modify [flightplan.remote.js](flightplan.remote.js), [flightplan.config.js](flightplan.config.js), [Makefile](Makefile), [package.json](package.json), [.env](.env) and [.env.example](.env.example) files.

#### `$ make production-db-replace-clone`

Creates dump of your local database and replaces production database with the newly created dump.

#### `$ make production-update`

Update WordPress Composer dependencies. Note that if you have private repositories, you need to configure SSH key pair with the server and git remote.

#### `$ make production-assets-push`

Push your local assets to the production server.

#### `$ make production-theme-deploy`

Wrapper command for deploying theme.

#### `$ make production-deploy`

Deploy and update everything. Shorcut for `$ make production-update` & `$ make production-theme-deploy`.


---

You may learn more about the project and issues in [Rebirth — WordPress Development Environment](https://github.com/joonassandell/rebirth-wordpress-project)
