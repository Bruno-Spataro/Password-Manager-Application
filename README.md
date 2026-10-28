# 🔐 Mis Contraseñas

A secure, portable password manager that runs entirely in your browser — no server, no account, no tracking. Just one HTML file standing between your passwords and the world.

**[→ Open the app](https://bruno-spataro.github.io/Password-Manager-Application/)**

## Why

Most password managers ask you to trust a company with your data. This one doesn't ask — because it can't. There's no backend to send anything to. Everything happens on your own device, encrypted before it ever touches disk.

## Features

- **Strong encryption at rest** — AES-256-GCM with a PBKDF2-derived key (250,000 iterations) from your master password
- **Installable PWA** — add it to your home screen and it works offline, on phone or desktop
- **Enforced strong master password** — minimum 8 characters with upper/lowercase, numbers, and symbols
- **Optional biometric unlock** — Face ID / Touch ID / fingerprint via WebAuthn, never replacing your master password, only speeding up access on your own device
- **Breach checking** — check your passwords against [Have I Been Pwned](https://haveibeenpwned.com/) using k-anonymity, so your real password never leaves your device
- **Password health dashboard** — flags reused, weak, old, or breached passwords at a glance
- **Encrypted backup & restore** — export a single encrypted `.json` file, import it on any device with the same master password
- **CSV import** — bring in passwords exported from Chrome or other browsers without overwriting what you already have
- **Auto-lock** — locks itself after inactivity or when backgrounded, with a short grace period so you can still paste a copied password
- **Dark mode, categories, favorites, trash, and drag-to-reorder**

## How it's built

A single `index.html` file — vanilla HTML, CSS, and JavaScript. No frameworks, no build step, no dependencies. Encryption is handled entirely by the browser's native [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).

```
index.html   → the entire app
sw.js        → service worker (offline support)
manifest.json → PWA metadata
```

## Running it yourself

No installation needed — just open `index.html` in a browser. To serve it locally (required for installable PWA features and the master-password strength checks to work the same way they do in production):

```bash
# any static file server works, for example:
npx serve .
```

## Security model, briefly

- Your master password is never stored, never leaves your device, and can't be recovered if you forget it.
- The exported backup file only contains your encrypted vault (plus your optional password hint, in plain text) — nothing else. No settings, no biometric data, nothing that could help an attacker without your master password.
- Biometric unlock (if enabled) is bound to the specific device's secure hardware — it can't be used on another device, even with the same backup file.

## License

Personal project, shared as-is.
