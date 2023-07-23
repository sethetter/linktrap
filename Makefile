.PHONY: deploy
deploy:
	fly deploy

.PHONY: redis
redis:
	fly redis connect

.PHONY: get-env
load-env:
	op document get linktrap-prod-env --outfile=.env
	
.PHONY: push-env
push-env:
	op document edit linktrap-prod-env .env
	cat .env | fly secrets import