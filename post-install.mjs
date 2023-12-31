import {exec} from 'node:child_process';

function runCmd(command) {
  return new Promise((resolve, reject) => {
    exec(
      command,
      {
        cwd: process.cwd(),
        stdio: 'inherit',
      },
      error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      },
    );
  });
}

async function vercelEnv() {
  if (process.env.VERCEL !== '1') {
    // Do nothing when not deploying to Vercel
    return;
  }

  await runCmd('git remote -v');

  throw new Error('This is a test error');
}

await vercelEnv();
