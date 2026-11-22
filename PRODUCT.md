# Product Specifications

## Purpose

Pennywise is a financial community and resource app that increases awareness and improves financial literacy among teenagers, covering topics such as debt management, loans, and saving. It was built for the Code Overflow 2024 hackathon and won the Committee Choice Award.

## Users

- Teenagers learning to manage money.

## Core Features

- **Accounts**: Users sign up and sign in with email and password through Better Auth. Sessions last seven days. See [`src/lib/auth.ts`](src/lib/auth.ts).
- **Lessons**: The learn page lists quiz lessons from [`src/data/lessons.json`](src/data/lessons.json). Answering every question correctly awards the lesson's points, which the server validates in [`src/lib/rewards.ts`](src/lib/rewards.ts).
- **Resources**: The learn page also links to external articles from [`src/data/resources.json`](src/data/resources.json).
- **Shop**: Users redeem points for rewards listed in [`src/data/shop.json`](src/data/shop.json). Redemption fails when the user has too few points.
- **Community**: Users publish posts with text and an optional media URL, and can edit or delete their own posts.
- **Assistance**: Signed-in users chat with an AI assistant that streams responses from an OpenRouter model.
- **Budgeting**: Users record expenses with a name, description, date, cost, and quantity, set a monthly budget, and see this month's spending against it.
- **Profile**: Users see their name and description, change them in settings, and sign out. The app bar shows their current points.

## Scope

- Users can only read and change their own expenses.
- Lessons, resources, and shop items are static data in the repository, not managed in the app.
- Shop redemptions deduct points only. There is no fulfillment of the rewards.
- Email addresses cannot be changed after sign-up.
