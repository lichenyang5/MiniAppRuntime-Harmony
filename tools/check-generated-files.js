'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const toolsDir = __dirname;
const scripts = ['generate-api-docs.js', 'generate-sdk-types.js'];

scripts.forEach((script) => {
  const result = spawnSync(process.execPath, [path.join(toolsDir, script), '--check'], {
    stdio: 'inherit'
  });
  if (result.error) {
    console.error(`[check-generated] ERROR: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
});

console.log('[check-generated] OK: generated docs and SDK types are current');
