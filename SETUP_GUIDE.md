# 🎮 Family Feud — Deployment Guide

## What you need (all free, ~15 min total)
- A Google account (for Firebase)
- A GitHub account (for Vercel deployment)

---

## Step 1 — Set up Firebase (real-time game sync)

1. Go to **https://firebase.google.com** and click **"Get started"**
2. Sign in with your Google account
3. Click **"Add project"** → name it `family-feud` → click through all screens
   - You can disable Google Analytics when asked
4. Once inside your project, click **"Firestore Database"** in the left sidebar
5. Click **"Create database"**
   - Choose **"Start in test mode"** (works for 30 days; see tip below to extend)
   - Pick any region close to you → click **Enable**
6. Click the **⚙️ gear icon** (top left) → **"Project settings"**
7. Scroll down to **"Your apps"** → click the **`</>`** (Web) button
8. Name it `family-feud-web` → click **"Register app"**
9. You'll see a code block with your config. Copy the `firebaseConfig` object — it looks like:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "family-feud-xxxxx.firebaseapp.com",
     projectId: "family-feud-xxxxx",
     storageBucket: "family-feud-xxxxx.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123:web:abc123"
   };
   ```

---

## Step 2 — Paste your Firebase config into the app

Open `src/App.jsx` and find this section near the top (around line 10):

```js
const firebaseConfig = {
  apiKey: "PASTE_YOUR_apiKey_HERE",
  authDomain: "PASTE_YOUR_authDomain_HERE",
  ...
};
```

Replace each placeholder value with the real values from Step 1. That's the only thing you need to change.

---

## Step 3 — Deploy to Vercel (free hosting)

### Option A: GitHub (recommended, no coding required)
1. Create a free account at **https://github.com**
2. Click **"New repository"** → name it `family-feud` → click **Create**
3. On the next screen, click **"uploading an existing file"** and drag in all the project files
4. Go to **https://vercel.com** → sign up/in with your GitHub account
5. Click **"Add New Project"** → import your `family-feud` repo
6. Vercel auto-detects Vite — just click **"Deploy"**
7. In ~60 seconds you get a live URL like `family-feud-xyz.vercel.app` 🎉

### Option B: Vercel CLI (if you're comfortable with Terminal)
```bash
npm install -g vercel
cd family-feud
npm install
vercel
```

---

## Step 4 — Run your event

Your app is live at your Vercel URL. At your event:

1. **You** open the URL on your phone → tap **"I'm the Host"**
2. Name your teams, add all your questions, then tap **"Open Lobby"**
3. A **5-letter game code** appears — announce it or show it on a screen
4. **Players** open the same URL → tap **"Join as Player"** → enter the code
5. Everyone picks their team in the lobby
6. You start the game — tap answers to flip them, use Strike and Switch Team buttons as needed
7. Scores update live on everyone's phones

---

## Tips

- **Write questions in advance** — you can add all your questions during setup before opening the lobby. Points don't need to add up to 100, but it helps with scoring balance.
- **QR code** — use any free QR generator (e.g. qr-code-generator.com) with your Vercel URL so players can scan instead of type the URL.
- **Firebase test mode expires after 30 days** — to extend it, go to Firestore → Rules in Firebase Console and update the date in the `allow` rule.
- **Multiple events** — each game gets a fresh code, so you can run back-to-back events without any cleanup.

---

## Costs

| Service | Cost |
|---------|------|
| Firebase Firestore | Free (up to 50k reads/day) |
| Vercel hosting | Free |
| **Total** | **$0** |
