.PHONY: push-env
push-env:
	cat .env | fly secrets import

.PHONY: deploy
deploy:
	fly deploy

.PHONY: redis
redis:
	fly redis connect