# Developer

## Participating

You can post an issue or you can open a PR, if there is a functionality that you think will be relevant to the project.

Your code will be posted using the same license as this project.

## Running tests

> npm test

Or

> yarn test

## Build

> npm run build

Or

> yarn build

## Docker local

Build:

> docker build --tag express-dorrent .

Running:

> docker run --rm --mount source=public,target=/app/public --detach --name express-dorrent express-dorrent

Debugging:

> docker exec -it express-dorent /bin/sh

Remember that the image is based on Alpine, so bash is not present.

If the container did not started, you will not be able to enter it.

## Deployment

I am using my [deployment-cli](https://github.com/isirode/deployment-cli) tool to deploy the server to a VPS.

I am using the `dcli` alias.

> dcli -s deploy.groovy -v values.toml -a build=true -a push=true -a startPod=true -a pushNginxConf=true

You can add the argument `--log-level=debug` to the Podman commands if there is a problem.

## Features

- [x] Serve files
- [x] Serve Dorrent files
  - [ ] System to allow to remove files based on a TTL

- [ ] Configuration
  - [ ] Use an environment conf
  - [ ] Configure the public directory location (static files)
  - [ ] Configure the dorrent directory location

## TODO

- Find a way to show when Node do not start on the remote server
  - It did not worked when not passing the package.json inside the image, since we are using esm ("type": "module") for instance

- Create a pod
  - It would need a volume, but I've encoutered problems in the past when using volumes with Podman
  - I would need to upgrade it
  - And the documentation is lacking
