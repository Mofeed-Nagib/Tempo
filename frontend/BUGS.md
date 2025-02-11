# Bugs

List of known bugs and issues.

1. Supabase Auth does not work with Turbo compiler. Currently we use the legacy compiler (no `--turbo` flag).

2. Regarding frontend unit-testing, we had to import `isomorphic-fetch`. See https://github.com/vercel/next.js/issues/32848
