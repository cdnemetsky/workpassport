# AI Work Passport backend

The public site remains hosted by GitHub Pages. Supabase supplies the secure account and database layer.

## What is already prepared

- User profile table
- Evidence table
- Private-by-default records
- Verified-only public Passport access
- Row Level Security
- Protection against a normal user marking their own evidence verified
- Automatic private profile creation on sign-up

## Remaining connection step

1. Create/connect the Supabase project.
2. Run `supabase-schema.sql`.
3. Add the project's public URL and anon key to a `supabase-config.js` file based on `supabase-config.example.js`.
4. Wire the existing front end to Supabase Auth and the evidence tables.

Never commit a Supabase service-role key to GitHub.
