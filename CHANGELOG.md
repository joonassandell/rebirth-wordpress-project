# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.0.4x] - 2019-06-26

- Add WPMS support
- Use [WP-CLI](https://wp-cli.org)
- Remove protocol example from PRODUCTION_URL
- `PRODUCTION_URL` -> `PRODUCTION_DOMAIN`
- `DEVELOPMENT_URL` -> `DEVELOPMENT_DOMAIN`
- Add PRODUCTION_WP_HOME in case WordPress home is located in subfolder
- Update plugins & add useful default plugins
- Add prettier
- Display errors in file (wp-content/)

## [0.0.3] - 2019-17-11

- Clear composer caches always
- Update docker PHP version 7.1 -> 7.3
- Update plugin versions

## [0.0.2] - 2018-15-11

- Remove theme related installations to prevent errors
- Remove WPML Translation Management
- Add version to `package.json`
- Ignore uploads/ folder
- Add better method for working with the theme. Use git instead of composer.
- Better remote composer installation

## [0.0.1] - 2018-05-11

- Init project. These type of boilerplates were used to generate with [generator-rebirth](https://github.com/joonasy/generator-rebirth) which removed the feature in [0.6.0](https://github.com/joonasy/generator-rebirth/blob/master/CHANGELOG.md). That generator is now only used to create themes.
