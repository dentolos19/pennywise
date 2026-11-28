<img alt="Pennywise" src="banner.png">

---

Pennywise is a financial community and resource app that helps teenagers build money skills, from saving to managing debt and loans. It was built for the Code Overflow 2024 hackathon, where it won the Committee Choice Award.

Users learn through short quizzes, earn points to redeem in a rewards shop, share posts with the community, ask an AI assistant for help, and track their spending against a monthly budget.

## Features

- **Lessons**: Quiz lessons that award points when every answer is correct.
- **Resources**: Curated external articles on personal finance.
- **Shop**: Rewards that users redeem with their points.
- **Community**: Posts with text and optional media that users can edit or delete.
- **Assistance**: An AI assistant that streams answers from an OpenRouter model.
- **Budgeting**: An expense tracker with a monthly budget and this month's spending.

## Tech Stack

- [Vinext](https://vinext.dev) for running the Next.js App Router on Vite.
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) for hosting.
- [React](https://react.dev) for the user interface.
- [MUI](https://mui.com/material-ui/) and [Tailwind CSS](https://tailwindcss.com) for components and styling.
- [Drizzle ORM](https://orm.drizzle.team) and [Neon](https://neon.com) for the Postgres database.
- [Better Auth](https://better-auth.com) for email and password accounts.
- [AI SDK](https://ai-sdk.dev) and [OpenRouter](https://openrouter.ai) for the AI assistant.
- [Bun](https://bun.sh) for dependencies, linting, formatting, type checking, and tests.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.4 or newer
- [Just](https://just.systems) 1.41 or newer
- [Docker](https://www.docker.com) with Compose

### Setup

1. Copy `.env.template` to `.env` and fill in `BETTER_AUTH_SECRET` and `OPENROUTER_API_KEY`.

   ```sh
   cp .env.template .env
   ```

2. Install dependencies, start the local database, and apply migrations.

   ```sh
   just setup
   ```

3. Start the development server and open `http://localhost:3000`.

   ```sh
   just start
   ```

## Documentation

- [Cloudflare Development](docs/guides/cloudflare.md)

## License

Licensed under the [MIT License](LICENSE).
