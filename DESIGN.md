# Design System

## Framework

- The UI uses MUI (`@mui/material`) with `@mui/icons-material` for icons and `@mui/x-date-pickers` with Day.js for dates.
- [`src/components/app-provider.tsx`](src/components/app-provider.tsx) wraps the app in the MUI App Router cache provider with CSS layers enabled, the theme provider, `CssBaseline`, and the date picker localization provider.
- Chat responses render Markdown with `react-markdown` inside Tailwind Typography `prose prose-invert` classes.

## Styling

- Use MUI components for structure and controls, and Tailwind CSS utility classes through `className` for layout, spacing, sizing, and text size.
- [`src/app/globals.css`](src/app/globals.css) imports the Tailwind theme, preflight, and utility layers with the Typography plugin.
- Combine conditional classes with `clsx`.

## Tokens

- [`src/theme.ts`](src/theme.ts) defines a dark MUI palette with default MUI colors and radius.
- Typography uses Roboto at weights 300, 400, 500, and 700, loaded with `next/font/google`.
- No custom Tailwind theme tokens are defined.

## Layout

- The public landing page lives in `src/app/(public)/`, and signed-in pages live in `src/app/(platform)/` inside [`src/components/app-shell.tsx`](src/components/app-shell.tsx).
- The shell has a top app bar with the user's points, a permanent 200 pixel navigation drawer from the `sm` breakpoint, and a temporary drawer opened from a menu button on small screens.
- Content columns are centered with responsive widths, such as `mx-auto w-[90%] md:w-[60%] lg:w-[40%]`, and creation actions use a fixed `Fab` in the bottom right corner.

## Components

- Put shared views, such as loading, login, and not found states, in `src/components/views/`.
- Put React contexts in `src/components/contexts/`. Show feedback with the toast context, which renders an MUI `Snackbar` with an `Alert`.
- Use [`src/components/ui/form-status.tsx`](src/components/ui/form-status.tsx) to swap form buttons while a form action is pending.
- Put route-only components in a `_components/` folder next to the route, and server actions in an `actions.ts` file next to the route.
- Static images live in `public/assets/`.
