# Rebirth — WordPress Development Environment

This is a modern WordPress stack designed to work with [Rebirth](https://github.com/joonasy/rebirth) that helps you get started with the best development tools and project structure.

## Features

* Easy WordPress configuration with environment specific files
* Environment variables with [Dotenv](https://github.com/vlucas/phpdotenv) & [dotenv](https://github.com/motdotla/dotenv#readme) for deployments
* Better folder structure
* Uses composer for installing plugins. Includes useful plugins out of the box.
* Automatic WordPress installation to remote location
* Scripts for deploying databases and assets to remote locations
* Scripts for pulling assets and databases from remote locations

## Requirements

* GNU/Linux/Unix with Docker ([Docker toolbox](https://www.docker.com/products/docker-toolbox), [Vagrant](https://www.vagrantup.com/downloads.html) VM with Docker, [native Linux with Docker](http://docs.docker.com/linux/step_one/) or [Docker for Mac](https://docs.docker.com/docker-for-mac/)).
* [docker-compose](https://github.com/docker/compose)
* [Node.js](http://nodejs.org/)
* [Yarn](https://yarnpkg.com)

## Quick start

Quickly install with [create-project](https://github.com/mafintosh/create-project). Add your variables to the following one-liner: 

```
$ npx create-project my-project-dir-dev joonasy/rebirth-wordpress-dev --human-name="My Project" --theme-dir=my-theme-dir --author=joonasy --production-url=https://my-project.com --wpml-user-id="=8365..." --wpml-key="=gxNTN8dHlwZ..." --acf-key="=9wZXJ8ZGF0..."
```

After the installation is done jump to phase 3 in the next section.

## Getting started

This development template assumes that you are using [Rebirth](https://github.com/joonasy/rebirth) to develop your theme. However it is not required and you may use any theme you like.

**1. Clone this git repository and create your project folder**

    $ git clone https://github.com/joonasy/rebirth-wordpress-dev.git my-project-dir-dev

**2. Replace all of the following variables in all the project files with _machine readable format_**

* `{{name}}`: This is your project name (e.g. `my-project-dir-dev`; It's recommended to use same name as your project folders name which you created above. This should also be used for git urls).   
* `{{human-name}}`: This is your project human readable name (e.g. `My Project`).
* `{{theme-dir}}`: This will be your theme name/directory which will be generated later (e.g. `my-theme-dir`)
* `{{author}}`: Author of this project (e.g. `joonasy`)
* `{{production-url}}`: Website url of the project in which the app will be published (e.g. `https://project-name.com`) 
* `{{wpml-user-id}}` WPML user id. (e.g. `=8365`, _Note that you need to add the `=` sign in front here and in the following variables_)
* `{{wpml-key}}` WPML subscription key (e.g. `=gxNTN8dHlwZ...`)
* `{{acf-key}}` ACF subscription key (e.g. `=9wZXJ8ZGF0...`)

By default this template requires [WPML](http://wpml.org) and [ACF](https://www.advancedcustomfields.com) so you need to have those plugins purchased. ACF subscription key can be found from [advancedcustomfields.com/my-account](https://www.advancedcustomfields.com/my-account) and WPML user id and subscription key can be found from the download urls in [wpml.org/account/downloads/?user_id=YOUR_USER_ID&subscription_key=YOUR_KEY](https://wpml.org/account/downloads/). _If you don't need these plugins remove them from the [web/composer.json](web/composer.json)_.

**3. Install theme with Rebirth Yeoman generator**

If you don't want to use Rebirth you can skip this step.

1. Navigate to `web/wp-content/themes/`
2. Create your theme with [Rebirth Yeoman Generator](https://github.com/joonasy/generator-rebirth) and make sure the previously added {{theme-dir}} matches with the generated project name. 

```
$ yarn global add generator-rebirth
$ npx yo rebirth [theme-dir] --project=wordpress
```

**4. Install all the dependencies and kickstart the project**

1. Copy `.env.example` to `.env` and setup your environment variables
2. Make sure docker is running as the following command will require it

```
$ make start
```

Crab a cup of :coffee: as the installation process may take a while. If you are not able to run these please refer to the [Makefile](Makefile) and run the commands manually.

After the installation is done, navigate to [PROJECT.md](PROJECT.md) to learn about further installation process and available commands.

**5. Recommended actions**

1. Require your theme repository in [web/composer.json](web/composer.json) so it gets installed in further installation processes:

```
...
"repositories": [
  {
    "type": "vcs",
    "url": "git@bitbucket.org:{{author}}/{{theme-dir}}.git"
  }
],
"require-dev": {
  "{{author}}/{{theme-dir}}": "*@dev"
}
...
```

2. Make sure `PROJECT.md` contains correct information such as correct remote git links
3. Delete the following files 
    - This `README.md` 
    - Rename `PROJECT.md` to `README.md`
    - `CHANGELOG.md`
    - `.git` folder
4. Git init your fresh new project and remember to init your theme as well

Happy developing! 

## Changelog

See [CHANGELOG.md](/CHANGELOG.md)

## Useful information

### `web/wp-content/themes` is ignored

By default `web/wp-content/themes` is ignored by git because we don't want this development repository to track theme related changes nor we want to use submodules. This is recommended practice since things may get messy if we have multiple themes in a single project. If for some reason you want to track these changes, remove `web/wp-content/themes/*` from `.gitignore`.
