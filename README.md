This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel
## Receptionist Dashboard

The receptionist dashboard is available at `/dashboard`. It uses a server-side password check and an encrypted, HTTP-only session cookie. Configure these values in the deployment environment (or a local `.env` file):

```env
RECEPTIONIST_PASSWORD=
RECEPTIONIST_SESSION_PASSWORD=
RECEPTIONIST_CLINIC_ID=
RECEPTIONIST_SHIFT=evening
```

Set `RECEPTIONIST_PASSWORD` to a strong, unique staff password. `RECEPTIONIST_SESSION_PASSWORD` must be at least 32 characters; generate a random value, for example with `openssl rand -base64 32`. `RECEPTIONIST_CLINIC_ID` is the MongoDB `_id` of the clinic record. Keep `N8N_API_KEY` server-side and separate from the receptionist password. Production must use HTTPS so the session cookie is secure.

The dashboard lists today's waiting and serving patients, supports walk-in registration, and keeps “Call next” separate from “Finish visit.” Receptionists can pause/open WhatsApp and walk-in bookings, change today's WhatsApp cutoff (PKT), or close WhatsApp bookings for the day while leaving walk-ins available. These settings update the configured clinic record. Its queue refreshes every 15 seconds. The clinic shift defaults to `evening` and can be overridden with `RECEPTIONIST_SHIFT`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
