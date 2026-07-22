import '@lcy453/miniapp-runtime-harmony-web-sdk/iife';

// @ts-expect-error The IIFE subpath is a side-effect entry without named exports.
import { initMyASCF } from '@lcy453/miniapp-runtime-harmony-web-sdk/iife';

void initMyASCF;
