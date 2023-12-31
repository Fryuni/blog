import { spawn } from 'node:child_process';

function runCmd(command) {
  return new Promise((resolve, reject) => {
    console.log('Running command: ' + command);

    const child = spawn(command, [], {
      shell: true,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command "${command}" exited with code ${code}`));
      }
    });
  });
}

async function vercelEnv() {
  if (process.env.VERCEL !== '1') {
    // Do nothing when not deploying to Vercel
    return;
  }

  await runCmd('git remote -v');
  await runCmd('git branch -av');

  throw new Error('This is a test error');
}

await vercelEnv();
