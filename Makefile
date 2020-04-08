# =======================================
# Local Commands
# =======================================

start:
	npm install
	@if [ ! -f .env ]; then\
		cp .env.example .env;\
    fi
	npm run --silent start

start-clone:
	npm install
	@if [ ! -f .env ]; then\
		cp .env.example .env;\
    fi
	npm run --silent start
	npm run --silent db:pull
	npm run --silent assets:pull
	npm run --silent db:replace

up:
	docker-compose up -d

stop:
	docker-compose stop

update:
	npm run --silent update

rebuild:
	docker-compose stop
	docker-compose rm -f web
	docker-compose rm -f db
	make start

web-bash:
	docker-compose exec web bash

db-bash:
	docker-compose exec db bash

assets-pull:
	npm run --silent assets:pull

db-backup:
	npm run --silent db:backup

db-clean:
	rm -rf database/local
	rm -rf database/remote

db-commit:
	npm run --silent db:commit

db-reset:
	npm run --silent db:reset

db-pull:
	npm run --silent db:pull

db-replace:
	npm run --silent db:backup
	npm run --silent db:replace

db-replace-clone:
	npm run --silent db:backup
	npm run --silent db:pull
	npm run --silent db:replace

regenerate-thumbnails:
	docker-compose exec web bash -c "wp media regenerate --yes --allow-root"

replace-special-characters:
	docker-compose exec web bash -c "wp search-replace 'Ã„' 'Ä' --allow-root && \
	  wp search-replace 'Ã¤' 'ä' --allow-root && \
	  wp search-replace 'â€' '”' --allow-root && \
	  wp search-replace 'â€“' '–' --allow-root && \
	  wp search-replace 'â€”' '—' --allow-root && \
		wp search-replace 'Ã¶' 'ö' --allow-root"

bootstrap:
	rm -rf README.md
	rm -rf CHANGELOG.md
	mv PROJECT.md README.md
	@if [ ! -d .git ]; then\
		git init && git add . && git commit -m "Init";\
    fi


# =======================================
# Remote Commands
# =======================================

production-start:
	npm run --silent production:start

production-db-replace-clone:
	npm run --silent production:db:replace

production-update:
	npm run --silent production:update

production-assets-push:
	npm run --silent production:assets:push

production-theme-deploy:
	npm --prefix web/wp-content/themes/{{theme-dir}} run deploy

production-deploy:
	make production-update
	make production-theme-deploy
