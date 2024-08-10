# linktrap

A small API that takes a URL and returns an archived version of it.

## How it works

- `GET /?url=<the-url>` returns the archived URL.
- `GET /?url=<the-url>&redirect=1` responds with a redirect to the archived URL.