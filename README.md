# Docker Home Services

## Instructions

1. Clone the repo.
2. Configure Cloudflare
    * DNS Challenge (for LetsEncrypt verification) is enabled by default for cloudflare.
    * For a list of providers other than cloudflare, [check here](https://docs.traefik.io/v2.0/https/acme/#providers).
3. Setup [OAuth](https://github.com/thomseddon/traefik-forward-auth) **\***
4. Configure environmental variables (`.env` file)
    * Rename the included `env.example` to `.env`.
    * Edit variables in `.env` file.
    * All variables (ie. `$XXX`) in docker-compose.yml come from `.env` file stored in the same place as docker-compose.yml.
    * Ensure good permissions for the `.env` file (recommended: 640).
5. Edit `docker-compose.yml` to include only the services you want or add additional services to it. Be sure to read the comments for each app and create any required files.
6. (Optional) Put non-docker apps behind Traefik proxy by renaming `traefik/rules/app.toml.example` to `traefik/rules/app.toml` and editing its contents.

\* If OAuth is not configured then removing it from the [middlewares chain](./traefik/rules/middlewares-chains.toml) should be sufficient to allow other services to be accessable, although it would be better to just update the middlewares used by each individual service.

```diff
  [http.middlewares.chain-oauth]
    [http.middlewares.chain-oauth.chain]
-       middlewares = [ "middlewares-rate-limit", "middlewares-secure-headers", "middlewares-oauth"]
+       middlewares = [ "middlewares-rate-limit", "middlewares-secure-headers"]
```

---

For a great point of reference see [here](https://www.smarthomebeginner.com/traefik-2-docker-tutorial/)
