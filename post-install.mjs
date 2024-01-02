/*
 * Copyright (c) 2024.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {spawn} from 'node:child_process';
import {inspect} from 'node:util';

function runCmd(command) {
  return new Promise((resolve, reject) => {
    console.log(`Running command: ${command}`);

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

function computeVendorEnv() {
  const envKey = process.env.TURBO_CI_VENDOR_ENV_KEY;

  if (envKey === undefined) {
    return process.env;
  }

  const vendorEnv = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith(envKey)) {
      vendorEnv[key.slice(envKey.length)] = value;
    }
  }

  return vendorEnv;
}

const vendor = computeVendorEnv();

async function prepareVercel() {
  if (process.env.VERCEL !== '1') {
    // Do nothing when not deploying to Vercel
    return;
  }

  console.log('process.env', inspect(vendor, {depth: null}));

  const commitRef = vendor.GIT_COMMIT_SHA;

  await runCmd('git rev-list --count HEAD');

  await runCmd(`git pull --unshallow https://gitlab.com/Fryuni/blog.git master:${commitRef}`);

  await runCmd('git rev-list --count HEAD');
}

await prepareVercel();
