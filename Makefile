# Development
build:
	docker-compose build

down: 
	docker-compose down

down-prod:
	docker-compose -f docker-compose.prod.yml down

migrate:
	docker exec phaedra-server node_modules/.bin/knex migrate:latest

seed:
	docker exec phaedra-server node_modules/.bin/knex seed:run

stop:
	docker-compose stop

test:
	docker exec phaedra-server npm test

u:
	docker-compose up

up:
	docker-compose up -d

up-proj:
	docker-compose up -d
	docker exec phaedra-server node_modules/.bin/knex migrate:latest
	docker exec phaedra-server node_modules/.bin/knex seed:run
	
# Production
up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d