# Digital Help Desk for Older Adults

*Repository name: spurs. 5th Korea Code Fair Hackathon (2023), Bronze Award.*

A small Node.js service that answers questions about using digital devices, by text or by voice. It was built in one day at the 5th Korea Code Fair Hackathon (2023), where the project received a Bronze Award.

## The problem

Many people, a large share of them older adults, have trouble with everyday digital services: kiosks, mobile apps, online forms. Help is usually written for people who already know the basic vocabulary, and asking someone in person is not always possible. The idea behind this project was to let such users ask a question in their own words, including by speaking, and get a polite, plain-language answer.

## How it works

1. The browser records the user's question and sends the audio to the server (`POST /upload`). The server saves the raw request body to `audio.mp3` in the project directory.
2. The client calls `GET /getTranscription`. The server sends `audio.mp3` to OpenAI's Whisper model (`whisper-1`) and returns the transcribed text.
3. The client wraps the transcription in a Korean system instruction, prepended with one few-shot example (a question about pressing kiosk buttons and a model answer). The instruction tells the model that the user is digitally vulnerable and should receive polite, easy-to-follow explanations of how to use digital devices.
4. The client sends the conversation to `POST /getGptResponse`. The server forwards it to the OpenAI Chat Completions API (`gpt-4`) and returns the answer.
5. The client keeps the conversation history in memory and shows the transcription and the answer on the page, in an element with the id `text`.

Text questions use the same path from step 3 onward.

### Server endpoints (`audioserver.js`)

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/upload` | Stores the request body (recorded audio) as `audio.mp3` |
| GET | `/getTranscription` | Transcribes `audio.mp3` with Whisper and returns `{ response: text }` |
| POST | `/getGptResponse` | Takes `{ messages: [...] }`, calls GPT-4, returns `{ response: answer }` |

The server also serves static files from a `public/` directory, which is not included in this repository.

## Repository structure

```
.
├── audioserver.js   Express server: audio upload, Whisper transcription, GPT-4 chat
├── audioscript.js   Browser script: builds the prompt, calls the server, renders answers
├── audio.mp3        Sample recording left from development (the file is WebM data despite the name)
├── CNAME            Custom domain used for the hackathon deployment
├── package.json
└── .env.example
```

The user interface was partly built with Bubble.io during the hackathon and is not in this repository. According to the project owner, the full service also included an FAQ page and a feature that converts regional dialect into standard Korean; that code is not part of this repository either.

## Running locally

Requirements: Node.js 18 or later and an OpenAI API key.

```bash
npm install
cp .env.example .env      # then set OPENAI_API_KEY in .env
npm start                 # starts the server on http://localhost:4000
```

`audioscript.js` calls the server at `http://localhost:4000`. To use it, load the script in an HTML page that has an element with `id="text"` and that records audio and posts it to `/upload`; such a page is not included here.

## Context

- Event: 5th Korea Code Fair Hackathon, 2023 (one-day event)
- Result: Bronze Award
- All commits in this repository are by kjh0209 (Jihyeok Kim). They were uploaded after the event, so the history does not show how work was divided during the hackathon.
- The `CNAME` file points to `b.keotonhae.com`, the domain used for the hackathon deployment. It may no longer be live.

## Limitations

This is hackathon code and has not been maintained since 2023.

- A single fixed file (`audio.mp3`) holds the latest recording, so concurrent users would overwrite each other's audio.
- There is no error handling around the OpenAI calls; a failed request leaves the client waiting.
- CORS is open to all origins and the endpoints have no authentication or rate limiting, so a public deployment would let anyone spend the API key's quota.
- The client accepts a full message list, including the system prompt, from the browser, so the prompt can be changed by the caller.
- The server URL is hardcoded in the client script.
- The model names (`gpt-4`, `whisper-1`) and the `openai` Node SDK version reflect what was available in October 2023.
