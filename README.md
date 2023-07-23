# linktrap

Text a URL to the configured phone number, receive the archived version of that URL.

## How it works

- Twilio phone number hooked up to the `/twilio` endpoint.
- List of allowed `from` numbers stored in redis.
- The API endpoint..
  - checks the `from` number is in the allow list,
  - expects message content to be URLs intended for archiving,
  - submits the URL to [archive.is](https://archive.is),
  - then sends back the archived URL in the response.

## Secrets with git-crypt

```
$ mkdir -p .git/git-crypt/keys/
$ op document get linktrap-git-crypt-key --out-file=.git/git-crypt/keys/default
```