An example of typescript with type-graphql and docker.
Deployed with dokku, Docker Hub and DigitalOcean, based on some tutorials by [Ben Awad](https://github.com/benawad), specifically https://www.youtube.com/watch?v=AdHwBKKQHZ4.

Some changes:
- TLS for local development, actually dokku also adds TLS with nginx.
- Set express app to trust proxy.
- Added explicit instrospection through env variables to Apollo Playground.
- Added **Travis CI** integration, each **Github** commit will tested (though we don't have tests yet, so it will be skipped) and deployed with Travis by using the `travis.yml`, `.travis/*` and `deploy.sh` files.
- Travis CI notifications to a bot created by me. [alpha]
