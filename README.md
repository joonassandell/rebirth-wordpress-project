# Rebirth — WordPress Development Environment

## Features

* Easy WordPress configuration with environment specific files
* Environment variables with [Dotenv](https://github.com/vlucas/phpdotenv) & [dotenv](https://github.com/motdotla/dotenv#readme) for deployments
* Better folder structure
* Uses composer for installing plugins. Includes useful plugins out of the box.
* Automatic WordPress installation to remote location
* Scripts for pulling assets and databases from remote locations

## Requirements

* GNU/Linux/Unix with Docker ([Docker toolbox](https://www.docker.com/products/docker-toolbox), [Vagrant](https://www.vagrantup.com/downloads.html) VM with Docker, [native Linux with Docker](http://docs.docker.com/linux/step_one/) or [Docker for Mac](https://docs.docker.com/docker-for-mac/)).
* [docker-compose](https://github.com/docker/compose)
* [Node.js](http://nodejs.org/)
* [Yarn](https://yarnpkg.com)

## Quick start

Install with [create-project](https://github.com/mafintosh/create-project). After the installation is done jump to phase 3 in the next section.

```
$ npx create-project project-folder-dev --name=my-project --human-name="My Project" --theme-name=my-theme --author=joonasy --production-url=https://myproject.com --wpml-user-id= --wpml-key= --acf-key=
```

## Getting started

This development template assumes that you are using [Rebirth](https://github.com/joonasy/rebirth) to develop your theme. However it is not required and you may use any theme you like.

**1.** Clone this git repository and create your project folder

    $ git clone https://github.com/joonasy/rebirth-wordpress-project.git project-folder-dev

**2.** Replace all of the following variables in all the project files with _machine readable format_:

* `{{name}}` — This is your project name (e.g. `project-folder-dev`; For clarity it's recommended to use same name as declared above to the folder name, which should also be used for git urls).   
* `{{human-name}}` — This is your project human readable name (e.g. `Project Name`).
* `{{theme-name}}` — This will be your theme name which will be generated later e.g. `project-name-theme`.
* `{{author}}` — Author of this project e.g. `joonasy`
* `{{production-url}}` — Website url of the project in which the app will be published e.g. `https://project-name.com` 
* `{{wpml-user-id}}` WPML user id e.g. `8365` 
* `{{wpml-key}}` WPML subscription key `gxNTN8dHlwZ...`
* `{{acf-key}}` ACF subscription key e.g. `9wZXJ8ZGF0...`

By default this template requires [WPML](http://wpml.org) and [ACF](https://www.advancedcustomfields.com) so you need to have those plugins purchased. ACF subscription key can be found from [advancedcustomfields.com/my-account](https://www.advancedcustomfields.com/my-account) and WPML user id and subscription key can be found from the download url in [https://wpml.org/account/downloads/?download=6088user_id=YOUR_USER_ID&subscription_key=YOUR_KEY](https://wpml.org/account/downloads/). _If you don't need these plugins remove them from the [web/composer.json](web/composer.json)_.

**3.** Install theme with Rebirth Yeoman generator

If you don't want to use Rebirth you can skip this step.

1. Navigate to `web/wp-content/themes/`
2. Create your theme with [Rebirth Yeoman Generator](https://github.com/joonasy/generator-rebirth) and make sure the previously added {{theme-name}} matches with the generated project name. 

```
// Install yeoman and the generator
$ yarn global add yo
$ yarn global add generator-rebirt
// Create theme
$ yo rebirth [theme-name] --project=wordpress
```

**4.** Install all the dependencies and kickstart the project

Make sure docker is running as the following command will require it.

```
$ make start
```

Crab a cup of :coffee: as the installation process may take a while. If you are not able to run these please refer to the [Makefile](Makefile) and run the commands manually.

After the installation is done, navigate to [PROJECT.md](PROJECT.md) to learn about further installation process and available commands.

**5.** Recommended actions

1. Require your theme repository in [web/composer.json](web/composer.json) so it gets installed in further installation processes:

```
...
"repositories": [
    {
    "type": "vcs",
    "url": "git@bitbucket.org:{{author}}/{{theme-name}}.git"
    }
],
"require-dev": {
    "{{author}}/{{theme-name}}": "*"
}
...
```

2. Make sure `PROJECT.md` contains correct information such as correct remote git links
3. Delete the following files 
    - This `README.md` 
    - Rename `PROJECT.md` to `README.md`
    - `CHANGELOG.md`
    - `.git` folder
4. Git init your fresh new project

Happy developing! 

## Nice to know

By default `web/wp-content/themes` is ignored by git because we don't want this development repository to track theme related changes nor we want to use submodules. This is recommended practice since things may get messy if we have multiple themes in a single project. If for some reason you want to track these changes, add `!web/wp-content/themes` to `.gitignore`.
