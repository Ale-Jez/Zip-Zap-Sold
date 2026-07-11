# Project instructions

## OpenAI API credentials

- Load `OPENAI_API_KEY` from the repository-local `.env.local` only when a task explicitly asks to use the OpenAI API.
- Never print, echo, commit, or include the key in generated artifacts or logs.
- Keep `.env.local` ignored by Git.

## Audio transcription

- When explicitly asked to transcribe audio with OpenAI, verify the current model in the official OpenAI developer documentation before choosing it.
- Prefer the current transcription model with built-in speaker diarization when the recording contains multiple speakers. As of 2026-07-11, this is `gpt-4o-transcribe-diarize` through `v1/audio/transcriptions`.
- Preserve context, repetitions, filler words, false starts, and audible uncertainty when a verbatim transcript is requested.
- Label speakers consistently and include timestamps when the API response provides them.
- For files above the API size or duration limits, split on silence with a small overlap, transcribe chunks in order, and reconcile speaker labels and overlap at chunk boundaries.
