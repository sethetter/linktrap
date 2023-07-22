FROM denoland/deno:latest
EXPOSE 8000
WORKDIR /app
ADD . /app
RUN deno cache main.ts
CMD ["run", "--allow-net", "--allow-env", "main.ts"]