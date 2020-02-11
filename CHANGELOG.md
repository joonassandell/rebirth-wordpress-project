# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.0.7] - 2020-02-06

- Automatically delete unnecessary files & git init with `$ make bootstrap`
- Automatically install theme node_modules
- Automatically add .env.example -> .env
- Automatically add theme .env.example -> .env
- Fix if someone accidentally adds "/" to home variable (PRODUCTION_WP_HOME=/). 
- Add missing --allow-root
- Tweaked instructions, updated deps
- Don't ignore `web/wp-content/themes/*` by default to keep things simple
- Run theme build automatically in start
- Don't skip guid in database replaces
- Remove WP-Rocket, add litespeed instead

## [0.0.6] - 2019-08-10

- Yarn -> Npm
- Add missing .editorconfig

## [0.0.5] - 2019-10-07

- Update WPMS instructions
- Revert `PRODUCTION_DOMAIN` -> `PRODUCTION_URL` &  `DEVELOPMENT_DOMAIN` -> `DEVELOPMENT_URL` because protocols may vary
- Add WP-Rocket & update deps
- Fix WPMS string replacing in database cloning & deploying
- Update instructions for WPMS
- Install theme node_modules automatically
- Install theme composer dependencies automatically
- `define('WP_DEV', true)` removed. Use real env variables instead for this.

## [0.0.4] - 2019-06-26

- Add WPMS support
- Use [WP-CLI](https://wp-cli.org)
- Remove protocol example from PRODUCTION_URL
- `PRODUCTION_URL` -> `PRODUCTION_DOMAIN`
- `DEVELOPMENT_URL` -> `DEVELOPMENT_DOMAIN`
- Add PRODUCTION_WP_HOME in case WordPress home is located in subfolder
- Update plugins & add useful default plugins
- Add prettier
- Display errors in file (wp-content/)

## [0.0.3] - 2019-03-17

- Clear composer caches always
- Update docker PHP version 7.1 -> 7.3
- Update plugin versions

## [0.0.2] - 2019-02-13

- Remove theme related installations to prevent errors
- Remove WPML Translation Management
- Add version to `package.json`
- Ignore uploads/ folder
- Add better method for working with the theme. Use git instead of composer.
- Better remote composer installation

## [0.0.1] - 2018-11-07

- Init project. These type of boilerplates were used to generate with [generator-rebirth](https://github.com/joonasy/generator-rebirth) which removed the feature in [0.6.0](https://github.com/joonasy/generator-rebirth/blob/master/CHANGELOG.md). That generator is now only used to create themes.
