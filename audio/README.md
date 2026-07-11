# Voice files for the flour-alternative call

Add these MP3 files to this folder before placing the live Twilio calls:

## Call 1 — morning cheesecake conversation

- `morning-cheesecake-greeting.mp3` — “Good morning, my dear! How are you feeling today?”
- `morning-cheesecake-help.mp3` — “I’m sorry to hear that. How can I help you today?”
- `morning-cheesecake-goodbye.mp3` — “A cheesecake? What a lovely idea! Let’s make it together. Take care, sweetheart!”

Your friend speaks naturally after the greeting and the help prompt. The final file plays after the friend asks to make a cheesecake.

## Call 2 — flour alternative

- `flour-alternative-question.mp3` — the first Voice Assistant line ending with “Would you like me to order it for you?”
- `flour-alternative-confirmation.mp3` — “Perfect! I’ll take care of it right away. Your cheesecake is going to be absolutely delightful!”

When `PUBLIC_BASE_URL` points to a public HTTPS deployment of this server, Twilio fetches and plays these files during the call. If a file is absent, the app safely falls back to Twilio’s text-to-speech for that line.
