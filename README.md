# :heavy_check_mark: NO AI TOOLS HAS BEEN USED :heavy_check_mark:

Parallel processing demo script

# Run

## :hammer: Dev container with watch mode

```sh
docker compose up deps # Install dependencies
docker compose up init-env # Initialize .env file
```

```sh
docker compose up dev # Run processing
```

### :test_tube: Unittests

```sh
docker compose up test # Run unittests
```

## :package: Prod container

> Production container doesn't require `deps` and `init-env`

```sh
docker compose up prod
```

# Run (_without Docker_)

```sh
npm ci           # Install dependencies
npm run init-env # Initialize .env file
npm start        # Run processing
npm t            # Unittests
```
