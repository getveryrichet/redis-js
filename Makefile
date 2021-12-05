install:
	npm install redis
	npm install express 

compose: compose-down
	docker-compose up -d


compose-down:
	docker-compose down --rmi all