![Keisoku Logo](assets/keisoku.png)

 > Keisoku is a self-hosted API that aggregates stats from GitHub, npm, and other platforms into a single configurable endpoint. Measure everything, manage nothing.

### Why?

I was making a website for one of my projects and I had to search how to get the GHCR download count of a package. Retrieving star count is plenty easy just use the github API. But for GHCR download count you have to retrieve the html of the package's page and regex out the number.

That's when this idea popped into my head, what if you could just have a central api to put all the stats you need to fetch into one request to one API. That API is Keisoku.


### How does it work?

Keisoku works with a central [TOML](https://toml.io/en/) config file, here you define server settings and the metrics you want to track. Metrics are defined like this

```toml
# Metric name is defined here, can be anything and will be used in the response
[metrics.metric_name]
# Here is defined what provider should be used to retrieve the information you want.
provider = "github_stars"
# Below are the inputs for that provider, in this case just the repository
repo = "kittendevv/Invio"
```

Providers live in `/src/providers/` as typescript files exporting functions named `providername_stat`. See [list of all providers](#providers).

Below is an example response of when you call `/api/all`.

```json
{
  "invio_stars": {
    "stars": 853
  },
  "invio_backend_downloads": {
    "downloads": 87172
  },
  "invio_downloads": {
    "downloads": 2035
  },
  "invio_total_downloads": {
    "total": {
      "raw": 89205,
      "formatted": "89.2K"
    }
  }
}
```

### Providers

Below is a list of currently supported providers

| Provider  | Metrics           | Key                      |
|-----------|-------------------|--------------------------|
| Github    | Stars             | github_stars             |
| Github    | Package Downloads | github_package_downloads |
| NPM       | Downloads         | npm_downloads            |

See [documentation](https://github.com/kittendevv/Keisoku/wiki) for exact configuration for each provider and stat.

### Selfhosting

WIP, still gonna dockerize and some other stuff
