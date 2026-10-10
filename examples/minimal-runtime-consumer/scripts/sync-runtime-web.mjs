import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const webDir = path.join(root, 'entry/src/main/resources/rawfile/web');
await mkdir(webDir, { recursive: true });
await copyFile(path.join(root, 'h5/index.html'), path.join(webDir, 'index.html'));
await copyFile(path.join(root, 'node_modules/@lcy453/miniapp-runtime-harmony-web-sdk/dist/myascf.js'), path.join(webDir, 'myascf.js'));
console.log('H5 页面和公开 npm SDK 已同步到 entry/src/main/resources/rawfile/web');
