#!/usr/bin/env node
// Generates a salt + PBKDF2 password hash matching functions/_lib/auth.js,
// so you can create/reset an admin-users.json entry without ever typing
// the plaintext password anywhere but this local, hidden terminal prompt.
//
// Usage: node scripts/generate-admin-hash.js
// Password input is masked and never printed, logged, or sent anywhere.

const crypto = require('crypto');
const readline = require('readline');

function toBase64Url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64');
}

function pbkdf2(password, saltBytes, iterations = 100000) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, saltBytes, iterations, 32, 'sha256', (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

let muted = false;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl._writeToOutput = (str) => { if (!muted) rl.output.write(str); };

function ask(question) {
  return new Promise((resolve) => rl.question(question, (answer) => resolve(answer.trim())));
}

function askHidden(question) {
  return new Promise((resolve) => {
    muted = false;
    rl.question(question, (answer) => {
      muted = false;
      process.stdout.write('\n');
      resolve(answer);
    });
    muted = true;
  });
}

async function main() {
  console.log('Generates a salt + password hash for functions/api/admin/setup.js or a manual');
  console.log('admin-users.json edit in Cloudflare KV. The plaintext password is never displayed,');
  console.log('printed, or sent anywhere — only typed into this masked local prompt.\n');

  const username = await ask('Username: ');
  const displayName = await ask('Display name: ');
  const password = await askHidden('Password (hidden): ');
  const confirm = await askHidden('Confirm password (hidden): ');

  if (password !== confirm) {
    console.error('\nPasswords did not match. Nothing generated.');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('\nPassword must be at least 8 characters (matches the dashboard\'s own rule).');
    process.exit(1);
  }

  const saltBytes = crypto.randomBytes(16);
  const salt = toBase64Url(saltBytes);
  const hashBytes = await pbkdf2(password, fromBase64Url(salt));
  const passwordHash = toBase64Url(hashBytes);

  console.log('\nAdd this object to the admin-users.json array in the fats-content KV namespace:\n');
  console.log(JSON.stringify({ username, displayName, salt, passwordHash }, null, 2));
  console.log('\n(salt and passwordHash are one-way — safe to paste here or store; the password itself was never captured beyond this prompt.)');
  rl.close();
}

main();
