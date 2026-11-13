# Robotic Admin Webapp

Admin portal for the SteamCup robotics programme. Admins and centre staff use it to manage students, centres, achievements and blog/competition posts. The app is served under the `/admin` path.

## Features

| Area | What it does |
| --- | --- |
| **Dashboard** | Lists blog and competition posts with search, category filter and sorting. Posts can be edited, deleted, and competition sign-ups exported to Excel. |
| **Students** | Paginated, filterable student list. View and edit a student, approve or reject sign-ups, renew membership, manage achievements, delete, manage levels, export to Excel. |
| **Centres** | Centre list with filters and a detail/approval modal. |
| **Achievements** | Create, edit and delete achievements with cropped image upload. |
| **Posts** | Create or edit a post with a rich-text editor, cover image library and custom sign-up fields. View a post and its participants. |
| **Auth** | AWS Cognito login, forgot password, OTP verification, token refresh and a maintenance-mode page. |

There are two roles, `admin` and `center`. Several actions (renew, delete, achievements) are admin-only.

## Tech stack

- **React 18** with **react-router-dom 6** (routes are lazy-loaded)
- **Chakra UI 2** and Emotion for styling, Framer Motion for animation
- **Redux Toolkit** with **RTK Query** for server state, and Redux for auth/app state
- **Formik** and **Yup** for forms and validation
- **TanStack Table 8** for data tables
- **React Quill** for the rich-text editor, **react-easy-crop** for image cropping
- **AWS Cognito** (`amazon-cognito-identity-js`) for authentication
- **CRA (react-scripts 5)** customised with **CRACO**

## Getting started

Requires Node 20 and npm.

```bash
npm ci
npm start
```

The dev server runs on [http://localhost:3000/admin](http://localhost:3000/admin).

### Environment variables

`craco.config.js` loads `config/.env.<DEPLOY_ENV>` and injects its values at build time. `DEPLOY_ENV` defaults to `uat`; a root `.env` can set it (for example `DEPLOY_ENV=development`).

| Variable | Purpose |
| --- | --- |
| `REACT_APP_BASE_API` | Backend API base URL |
| `REACT_APP_COGNITO_POOL_ID` | Cognito user pool ID |
| `REACT_APP_COGNITO_CLIENT_ID` | Cognito app client ID |

Environment files live in `config/` (`.env.development`, `.env.uat`). Add one per environment you deploy to.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the dev server |
| `npm run build` | Production build into `build/` |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint and auto-fix |
| `npm run format` | Format `src/` with Prettier |
| `npm test` | Run tests (none exist yet) |

## Project structure

```
src/
├── App.js              Route table (lazy-loaded pages, public and protected routes)
├── index.js            App entry: providers, theme, global styles
├── assets/             Images
├── components/         Shared UI and feature components (tables, modals, layout, toasts)
├── pages/              One folder per route
├── redux/
│   ├── createAppApi.js   RTK Query base API: auth header and 401 token refresh
│   ├── store.js
│   └── slices/           Per-feature API endpoints, plus app and achievements state
├── services/           Auth, Cognito and Excel export helpers
└── utils/              Constants, validation schemas, theme, Cognito user pool
```

Each `slices/<feature>/api.js` defines RTK Query endpoints. List pages read query results directly instead of copying them into Redux.

## Code style

- **Absolute imports only.** Relative `./` and `../` imports are an ESLint error. Use the aliases `@/`, `@components`, `@pages`, `@utils`, `@redux`, `@services` and `@assets`. They are defined in both `jsconfig.json` (editor) and `craco.config.js` (webpack), so change both together.
- Imports are sorted automatically by `simple-import-sort`.
- Prettier is enforced through ESLint (single quotes, no trailing commas, 100 columns).
- `react-hooks/exhaustive-deps` is on. Where a dependency is left out on purpose, the line has an `eslint-disable` comment.

Run `npm run lint` before committing.

## Deployment

- The `Dockerfile` builds the app in a Node 20 image and serves `build/` with nginx on port 8080 (`config/nginx.conf`, which strips the `/admin` prefix and sets cache headers). Pass `--build-arg DEPLOY_ENV=<env>` to pick the environment file.
- Pushing to `uat` or `master` triggers the GitHub Actions CI workflow, which builds and pushes the Docker image to Docker Hub. A CD workflow then pulls it and restarts the container on a self-hosted runner (host port 3004).
- Development work is merged into `develop` through pull requests.
