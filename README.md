# Job Search Launcher

Static job-search query launcher. It can be deployed directly to Vercel with no build step.

## Deploy with Vercel CLI

From this folder:

```sh
npx vercel
```

For production:

```sh
npx vercel --prod
```

When Vercel asks for project settings, use:

- Framework preset: Other
- Build command: leave blank
- Output directory: leave blank or `.`

## Deploy from Git

Push this repository to GitHub, import it in Vercel, and set the root directory to:

```text
job-search-recreator
```

No build command is needed.
