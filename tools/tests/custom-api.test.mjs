import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const sdkRequire = createRequire(path.join(root, 'h5_sdk/package.json'));
const ts = sdkRequire('typescript');
const temporary = mkdtempSync(path.join(tmpdir(), 'runtime-custom-api-'));
after(() => {
  assert.equal(path.dirname(path.resolve(temporary)), path.resolve(tmpdir()));
  assert.ok(path.basename(temporary).startsWith('runtime-custom-api-'));
  rmSync(temporary, { recursive: true, force: true });
});
// Execute the actual ArkTS logic; only the platform logger is replaced.
// Native type checking and HAR packaging remain separate DevEco checks.
for (const name of ['api/BridgeTypes', 'api/ActionNames', 'api/ApiManifest', 'error/BridgeErrorCode',
  'registry/HandlerRegistry', 'biz/RuntimeInfoBiz', 'logger/RuntimeLogger', 'dispatcher/BridgeDispatcher']) {
  const source = readFileSync(path.join(root, 'myascf_runtime/src/main/ets', name + '.ets'), 'utf8');
  const output = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  const destination = path.join(temporary, name + '.js');
  mkdirSync(path.dirname(destination), {recursive:true});
  writeFileSync(destination, output.replace('require("@kit.PerformanceAnalysisKit")', 'require("../platform-log.js")'));
}
writeFileSync(path.join(temporary, 'platform-log.js'), `
exports.messages=[];
exports.hilog={info(...args){exports.messages.push(args.at(-1));},warn(){},error(){}};
`);
const require = createRequire(path.join(temporary, 'runner.js'));
const {HandlerRegistry} = require('./registry/HandlerRegistry.js');
const {RuntimeInfoBiz} = require('./biz/RuntimeInfoBiz.js');
const {BridgeDispatcher} = require('./dispatcher/BridgeDispatcher.js');
const {RuntimeLogger} = require('./logger/RuntimeLogger.js');
const {messages} = require('./platform-log.js');
const echo = { async handle(request) {
  return {requestId:request.requestId, code:0, message:'ok', data:{text:request.params?.text}};
}};

test('custom API routes through actual dispatcher and preserves built-in handlers', async () => {
  const registry = new HandlerRegistry();
  registry.register('system.storage.getItem', echo);
  registry.registerCustomApi('app.echo', echo);
  const dispatcher = new BridgeDispatcher(registry);
  assert.deepEqual(await dispatcher.dispatch({requestId:'custom-1',action:'app.echo',params:{text:'鸿蒙'}}),
    {requestId:'custom-1',code:0,message:'ok',data:{text:'鸿蒙'}});
  assert.equal((await dispatcher.dispatch({requestId:'builtin-1',action:'system.storage.getItem'})).code, 0);
  assert.equal((await dispatcher.dispatch({requestId:'unknown-1',action:'app.missing'})).code, 1001);
});

test('API list discovers registrations after runtime info is created and hides internal actions', async () => {
  const registry = new HandlerRegistry();
  const info = new RuntimeInfoBiz(registry);
  const request = {requestId:'list',action:'runtime.getApiList'};
  assert.equal((await info.getApiList(request)).data.apis.length, 9);
  const metadata = {title:'Echo',description:'Host echo',paramsText:'text?: string'};
  registry.registerCustomApi('app.echo', echo, metadata);
  metadata.title = 'mutated';
  const first = (await info.getApiList(request)).data.apis;
  assert.equal(first.length, 10);
  assert.equal(first.at(-1).title, 'Echo');
  assert.equal(first.some((item) => item.action === 'network.abort'), false);
  first.at(-1).title = 'caller mutated';
  assert.equal((await info.getApiList(request)).data.apis.at(-1).title, 'Echo');
});

test('invalid names, handler, metadata and duplicate registrations fail without changing registry', () => {
  const registry = new HandlerRegistry();
  for (const action of ['', 'ui.showToast', 'runtime.getApiList', 'network.abort', 'app.', 'app..echo',
    'app.echo ', 'app.' + 'a'.repeat(125)]) {
    assert.throws(() => registry.registerCustomApi(action, echo));
  }
  assert.throws(() => registry.registerCustomApi('app.invalid', {}));
  assert.throws(() => registry.registerCustomApi('app.invalid', echo, {title:'',description:'',paramsText:''}));
  assert.equal(registry.has('app.invalid'), false);
  registry.registerCustomApi('app.echo', echo);
  assert.throws(() => registry.registerCustomApi('app.echo', {handle: async () => {throw new Error('replacement');}}));
  assert.equal(registry.get('app.echo'), echo);
  assert.equal(registry.getCustomSummaries().length, 1);
});

test('custom handler rejection becomes correlated framework error', async () => {
  const registry = new HandlerRegistry();
  registry.registerCustomApi('app.failure', {handle: async () => {throw new Error('test failure');}});
  const response = await new BridgeDispatcher(registry).dispatch({requestId:'failed',action:'app.failure'});
  assert.equal(response.code, 1003);
  assert.equal(response.requestId, 'failed');
});

test('registries keep host APIs isolated', () => {
  const first = new HandlerRegistry();
  const second = new HandlerRegistry();
  first.registerCustomApi('app.echo', echo);
  assert.equal(second.has('app.echo'), false);
  assert.deepEqual(second.getCustomSummaries(), []);
  assert.equal(first.getCustomSummaries()[0].title, 'app.echo');
});

test('parameter logs redact host backup, storage and clipboard contents without changing requests', () => {
  for (const action of ['app.backup.saveFile', 'system.storage.setItem', 'system.clipboard.writeText']) {
    messages.length = 0;
    const request = {requestId:'private-1', action, params:{text:'private-todo-正文', key:'private-key', value:'private-value'}};
    const before = structuredClone(request);
    RuntimeLogger.logBridgeParams(request);
    assert.deepEqual(request, before);
    assert.deepEqual(messages, ['[BridgeController] params: [redacted]']);
  }
});

test('network logs retain diagnostics while excluding credentials, query, header values and body', () => {
  messages.length = 0;
  RuntimeLogger.logBridgeParams({requestId:'network-private', action:'network.request', params:{
    url:'https://alice:secret@example.com/tasks?token=private#secret', method:'POST',
    headers:{Authorization:'Bearer private-token'}, body:'private-body', timeout:1000, responseType:'text'
  }});
  assert.equal(messages.length, 1);
  assert.match(messages[0], /url=https:\/\/example.com\/tasks, method=POST/);
  assert.match(messages[0], /headerNames=Authorization, bodyLength=12/);
  assert.doesNotMatch(messages[0], /alice|secret|private|Bearer|token=/);
});
