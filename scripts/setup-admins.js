#!/usr/bin/env node
// One-time bootstrap runner for functions/api/admin/setup.js.
// Only works while admin-users.json is empty in KV (delete/empty it first
// in the Cloudflare dashboard if accounts already exist).
//
// Prompts for the site URL, your SETUP_TOKEN secret, and one or more
// admin accounts (username / display name / password each). Passwords
// are masked and sent straight to the setup API over HTTPS — never
// printed, logged, or otherwise visible in this terminal session's
// output beyond the masked prompt itself.
//
// Usage: node scripts/setup-admins.js

const readline = require('readline');

let muted = false;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl._writeToOutput = (str) => { if (!muted) rl.output.write(str); };

function ask(question, fallback) {
  const q = fallback ? `${question} [${fallback}]: ` : `${question}: `;
  return new Promise((resolve) => rl.question(q, (answer) => {
    const trimmed = answer.trim();
    resolve(trimmed || fallback || '');
  }));
}

function askHidden(question) {
  return new Promise((resolve) => {
    muted = false;
    rl.question(`${question}: `, (answer) => {
      muted = false;
      process.stdout.write('\n');
      resolve(answer);
    });
    muted = true;
  });
}

async function main() {
  console.log('Bootstraps admin accounts via the one-time /api/admin/setup endpoint.');
  console.log('Only works if admin-users.json is currently empty/deleted in KV.\n');

  const baseUrl = await ask('Site base URL', 'https://ducks-new-build.fitnessatthestreet.pages.dev');
  const setupToken = await askHidden('SETUP_TOKEN (hidden)');

  const users = [];
  console.log('\nEnter each admin account. Leave username blank to stop adding.\n');
  while (true) {
    const username = await ask(`Account ${users.length + 1} — username (blank to finish)`);
    if (!username) break;
    const displayName = await ask('  Display name');
    const password = await askHidden('  Password (hidden)');
    if (password.length < 8) {
      console.log('  Password must be at least 8 characters — skipping this account.');
      continue;
    }
    users.push({ username, displayName, password });
    console.log(`  Added "${username}". Add another or leave blank to finish.\n`);
  }

  if (users.length === 0) {
    console.log('No accounts entered. Nothing sent.');
    rl.close();
    return;
  }

  console.log(`\nSending ${users.length} account(s) to ${baseUrl}/api/admin/setup ...`);
  const res = await fetch(`${baseUrl}/api/admin/setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ setupToken, users }),
  });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error(`\nFailed (${res.status}): ${body.error || 'Unknown error'}`);
    if (res.status === 409) {
      console.error('admin-users.json already has accounts — delete/empty that KV key first.');
    }
  } else {
    console.log(`\nDone. Created: ${(body.createdUsernames || []).join(', ')}`);
  }

  rl.close();
}

main();
