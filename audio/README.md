# Voice files for the flour-alternative call

Add these two MP3 files to this folder before placing the live Twilio call:

- `flour-alternative-question.mp3` — the first Voice Assistant line ending with “Would you like me to order it for you?”
- `flour-alternative-confirmation.mp3` — “Perfect! I’ll take care of it right away. Your cheesecake is going to be absolutely delightful!”

When `PUBLIC_BASE_URL` points to a public HTTPS deployment of this server, Twilio fetches and plays these files during the call. If either file is absent, the app safely falls back to Twilio’s text-to-speech for that line.
