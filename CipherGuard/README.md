# CipherGuard — Password Strength Analyzer

CipherGuard is a responsive password-strength checking web app built with HTML, CSS, JavaScript, and Node.js/Express.

## Features
- Live password strength estimate and visual meter
- Checks length, uppercase/lowercase, numbers, symbols, repeated characters, common patterns, and common passwords
- Shows actionable improvements
- Show/hide password control
- Random password generator (runs in the browser)
- Copy generated password
- Responsive design for mobile and desktop
- Health endpoint at `/api/health` for deployment checks

## Privacy and security notes
- Password analysis happens in the browser. The password is **not sent to the server**, stored, or logged by this app.
- Do not enter a password you currently use for an important account into any third-party password checker. Use a unique test password for demonstrations.
- The score is an educational estimate, not a guarantee that a password is safe. This app does not query a breached-password database.
- For real accounts, use a unique password or passphrase and enable multi-factor authentication.

## Run locally (Windows)
1. Install Node.js LTS from https://nodejs.org/
2. Extract the ZIP.
3. Open the extracted `CipherGuard` folder in VS Code.
4. Open Terminal → New Terminal.
5. Run:
   ```bash
   npm install
   npm start
   ```
6. Open http://localhost:3000

If PowerShell blocks `npm`, try `npm.cmd install` and `npm.cmd start`.

## Deploy on Render
1. Create a GitHub repository and upload the contents of this folder (the files inside `CipherGuard`, not an extra nested folder if possible).
2. Sign in at https://render.com and choose **New + → Web Service**.
3. Connect the GitHub repository.
4. Use these settings:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **Deploy**. Render will provide a public URL.
6. Check `https://YOUR-APP.onrender.com/api/health` and confirm it returns JSON with `"status":"ok"`.

The included `render.yaml` can also be used for Render Blueprint deployment.

## Deploy on Railway
1. Push the project to GitHub.
2. Create a new project on https://railway.app and deploy from the repository.
3. Railway should detect Node.js and use `npm start`. If prompted, set the start command to `npm start`.
4. Generate a public domain in the service's networking settings.

## Project structure
```text
CipherGuard/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server.js
├── package.json
├── render.yaml
├── .gitignore
└── README.md
```

## Tech stack
- Frontend: HTML5, CSS3, vanilla JavaScript
- Backend: Node.js + Express
- Deployment: Render or Railway

## Important implementation detail
The Express server only serves static files and a health endpoint. The password is evaluated entirely in `public/app.js`; it is never submitted to an API endpoint.
