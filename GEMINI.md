# GEMINI.md — Workspace rules for VintedHelper

## Mission
Build a production-minded MVP for **VintedHelper**.
Prioritize clarity, maintainability, secure Supabase integration, and an excellent UX over flashy implementation.

## Stack decision
Unless there is a blocking reason, use:
- Next.js latest stable with App Router
- TypeScript strict mode
- Tailwind CSS
- shadcn/ui
- Supabase Auth, Database, and Storage
- Zod for validation

## Product rules
- There are **two distinct page types**: `AI Listing Page` and `Market Research Page`.
- Do not merge these two concepts into a single ambiguous model.
- Folder and subfolder organization is a core feature, not a secondary one.
- Title, description, and price are optional for AI Listing Pages.
- Market Research Pages support image carousel, min/max price, and clipboard image paste.

## UX rules
- Keep the UI sober, clean, and user friendly.
- Use white and blue as dominant colors.
- Prefer simple navigation and clear empty states.
- Optimize for fast repeated use by a solo seller.
- Mobile responsiveness is mandatory.

## Engineering rules
- Prefer server-side secure operations when data integrity matters.
- Enforce Supabase RLS from the beginning.
- Use reusable components and typed domain models.
- Keep business logic separated from presentation.
- Avoid overengineering the first version.

## Delivery rules
When generating the project:
1. scaffold the app structure
2. define the database schema
3. implement auth
4. implement folders and subfolders
5. implement both page types
6. implement image uploads and carousel
7. wire a placeholder AI generation flow
8. document local setup clearly

## Quality bar
- no dead code
- no placeholder lorem ipsum in core screens
- no broken links or empty handlers
- forms must have validation and user feedback
- all data shown must be scoped to the authenticated user
