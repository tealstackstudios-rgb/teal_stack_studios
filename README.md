# Teal Stack Studios website

This is a lightweight static website built with HTML, CSS and JavaScript. It has no package install or build step.

## Preview locally

From this folder, run:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8000`.

## Before launch

- Submitted visuals are now placed in the matching Work cards and case studies. The Stories in Motion cover uses the studio logo image supplied for it; replace that cover with a video still if you prefer.
- Add live project URLs in the case-study files when those links are ready.
- Add real client quotes and attributions to `testimonials.html` when they are approved for publication.
- Prices are currently listed as “Price on request” because rates were not provided.
- The appointment form uses the Cloudflare Pages Function at `functions/api/appointment.js` and sends inquiries to `tealstackstudios@gmail.com` through Resend. Set `RESEND_API_KEY` as a secret in the Cloudflare Pages project under **Settings → Variables and Secrets**. For the default Resend sender (`onboarding@resend.dev`), create the Resend account with the destination Gmail address and verify that address. For a branded sender, verify a domain with Resend and set `RESEND_FROM_EMAIL` to an address on that verified domain. Never commit the API key.
- The public domain has not been provided, so no canonical URL is configured.

The animated aurora effect runs in one hero visual, uses a capped render resolution, pauses when off screen, and has a static fallback for reduced-motion or WebGL-disabled devices.
