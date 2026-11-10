```
    _    _     _____ ____  _____ ____  
   / \  | |   |  ___|  _ \| ____|  _ \ 
  / _ \ | |   | |_  | |_) |  _| | | | |
 / ___ \| |___|  _| |  _ <| |___| |_| |
/_/   \_\_____|_|   |_| \_\_____|____/ 
```

# Your personal butler.

## To launch, open a CLI and enter `alfred`.

Alfred is a CLI chat app (Node.js + Ink, a terminal-UI React renderer) that talks to OpenAI's gpt-4o-mini model with a couple of tools.

To run it:

1. Install dependencies (already done — node_modules exists): npm install
2. Make sure OPENAI_API_KEY is available — either export it in your shell or put it in the .env file next to index.js (one already exists at D:\alfred\.env; index.js loads it automatically).
3. Run it directly:
node index.js
3. or, since package.json declares a bin entry (alfred), after npm link (or npm install -g .) you could just run:
alfred

Once running, it opens an interactive terminal chat UI — type a message and press Enter, or /exit//quit to leave.

There's also an eval runner: `npm run eval`.
