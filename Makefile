# Development

build:
	docker-compose build

down: 
	docker-compose down

stop:
	docker-compose stop

up:
	docker-compose up -d
	
# Production

up-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d