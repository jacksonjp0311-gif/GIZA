import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

async function load(file) {
  const code = ts.transpileModule(fs.readFileSync(new URL('../src/' + file, import.meta.url), 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022},
  }).outputText;
  return import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
}
const {loadNotebook, saveNotebook, MAX_NOTEBOOK_BYTES} = await load('epigraphy/storage.ts');
const {emptyNotebook, newRegion, parseNotebook} = await load('epigraphy/model.ts');
const KEY = 'giza.epigraphy.dream-stela.v1';
const parse = value => parseNotebook(value, ['dream-photo'], ['N35']);
const sample = label => ({...emptyNotebook(), regions: [newRegion('synthetic-zone', 'dream-photo', [.1, .1, .2, .2], label)]});
function memory(raw = null) {
  let value = raw;
  const writes = [];
  return {
    getItem(key) { assert.equal(key, KEY); return value; },
    setItem(key, next) { assert.equal(key, KEY); writes.push(next); value = next; },
    get value() { return value; },
    get writes() { return writes; },
  };
}

test('a missing notebook loads without writing and saves the existing JSON schema', () => {
  const storage = memory();
  const loaded = loadNotebook(storage, KEY, parse);
  assert.equal(loaded.state, 'ready');
  assert.equal(loaded.baseline, null);
  assert.equal(loaded.raw, null);
  assert.deepEqual(loaded.notebook, emptyNotebook());
  assert.equal(storage.writes.length, 0);
  const next = sample('Synthetic reading');
  const saved = saveNotebook(storage, KEY, loaded.baseline, next);
  assert.equal(saved.ok, true);
  assert.equal(saved.baseline, storage.value);
  assert.deepEqual(JSON.parse(storage.value), next);
  assert.deepEqual(loadNotebook(storage, KEY, parse).notebook, next);
  assert.equal(storage.writes.length, 1);
});

test('load retains exact original bytes, including whitespace, as its baseline', () => {
  const raw = JSON.stringify(sample('Existing draft'), null, 2);
  const storage = memory(raw);
  const loaded = loadNotebook(storage, KEY, parse);
  assert.equal(loaded.raw, raw);
  assert.equal(loaded.baseline, raw);
  assert.equal(loaded.state, 'ready');
  assert.equal(storage.writes.length, 0);
  assert.equal(saveNotebook(storage, KEY, loaded.baseline, loaded.notebook).ok, true);
});

test('malformed and unsupported persisted data stays untouched and cannot be auto-saved over', () => {
  for (const raw of ['{unfinished', '', 'null', '{"schema":"other","regions":[]}']) {
    const storage = memory(raw);
    const loaded = loadNotebook(storage, KEY, parse);
    assert.equal(loaded.state, 'unreadable');
    assert.equal(loaded.baseline, undefined);
    assert.equal(loaded.raw, raw);
    assert.deepEqual(loaded.notebook, emptyNotebook());
    const saved = saveNotebook(storage, KEY, loaded.baseline, sample('Unsaved draft'));
    assert.equal(saved.ok, false);
    assert.equal(saved.reason, 'unavailable');
    assert.equal(storage.value, raw);
    assert.equal(storage.writes.length, 0);
  }
});

test('storage access failures and unavailable storage block load and save', () => {
  for (const storage of [null, undefined, {getItem() { throw new Error('Denied'); }, setItem() { assert.fail('Must not write'); }}]) {
    const loaded = loadNotebook(storage, KEY, parse);
    assert.equal(loaded.state, 'unavailable');
    assert.equal(loaded.baseline, undefined);
    assert.equal(saveNotebook(storage, KEY, loaded.baseline, emptyNotebook()).ok, false);
  }
  const unreadable = {getItem() { throw new Error('Denied'); }, setItem() { assert.fail('Must not write'); }};
  assert.equal(saveNotebook(unreadable, KEY, null, emptyNotebook()).reason, 'unavailable');
});

test('quota or write failure reports an unsaved draft without changing the old copy', () => {
  const raw = JSON.stringify(sample('Stored'));
  const storage = {getItem() { return raw; }, setItem() { throw new Error('QuotaExceededError'); }};
  const loaded = loadNotebook(storage, KEY, parse);
  const saved = saveNotebook(storage, KEY, loaded.baseline, sample('New draft'));
  assert.equal(saved.ok, false);
  assert.equal(saved.reason, 'unavailable');
  assert.equal(storage.getItem(KEY), raw);
  assert.match(saved.message, /do not assume it was saved/i);
});

test('two tabs that loaded the same baseline cannot sequentially overwrite each other', () => {
  const storage = memory(JSON.stringify(sample('Initial')));
  const a = loadNotebook(storage, KEY, parse);
  const b = loadNotebook(storage, KEY, parse);
  const savedA = saveNotebook(storage, KEY, a.baseline, sample('Tab A draft'));
  assert.equal(savedA.ok, true);
  const savedB = saveNotebook(storage, KEY, b.baseline, sample('Tab B draft'));
  assert.equal(savedB.ok, false);
  assert.equal(savedB.reason, 'conflict');
  assert.equal(JSON.parse(storage.value).regions[0].label, 'Tab A draft');
  assert.equal(storage.writes.length, 1);
  const reloadedB = loadNotebook(storage, KEY, parse);
  assert.equal(saveNotebook(storage, KEY, reloadedB.baseline, sample('After deliberate reload')).ok, true);
});

test('creation in another tab and deletion in another tab also count as conflicts', () => {
  const created = memory();
  const beforeCreation = loadNotebook(created, KEY, parse);
  created.setItem(KEY, JSON.stringify(sample('Other tab')));
  assert.equal(saveNotebook(created, KEY, beforeCreation.baseline, sample('Local draft')).reason, 'conflict');
  let value = JSON.stringify(sample('Initial'));
  const deleted = {getItem() { return value; }, setItem() { assert.fail('Must not recreate after external deletion'); }};
  const beforeDeletion = loadNotebook(deleted, KEY, parse);
  value = null;
  assert.equal(saveNotebook(deleted, KEY, beforeDeletion.baseline, sample('Local draft')).reason, 'conflict');
});

test('identical saves avoid unnecessary writes but still reject a stale baseline', () => {
  const next = sample('Unchanged');
  const raw = JSON.stringify(next);
  const storage = memory(raw);
  assert.deepEqual(saveNotebook(storage, KEY, raw, next), {ok: true, baseline: raw});
  assert.equal(storage.writes.length, 0);
  assert.equal(saveNotebook(storage, KEY, null, next).reason, 'conflict');
});

test('readback detects an immediately competing write without reporting a successful save', () => {
  const other = JSON.stringify(sample('Other tab won'));
  let value = null;
  const storage = {getItem() { return value; }, setItem() { value = other; }};
  const saved = saveNotebook(storage, KEY, null, sample('Local draft'));
  assert.equal(saved.ok, false);
  assert.equal(saved.reason, 'conflict');
  assert.equal(value, other);
  // This is detection, not an atomic cross-tab compare-and-swap or a merge.
});

test('oversized UTF-8 notebooks are preserved on load and rejected before any save', () => {
  const oversized = JSON.stringify({...emptyNotebook(), note: '𓀀'.repeat(MAX_NOTEBOOK_BYTES / 4)});
  assert.ok(new TextEncoder().encode(oversized).byteLength > MAX_NOTEBOOK_BYTES);
  assert.ok(oversized.length < MAX_NOTEBOOK_BYTES, 'Byte limit must not be a character-count approximation');
  const storage = memory(oversized);
  const loaded = loadNotebook(storage, KEY, parse);
  assert.equal(loaded.state, 'unreadable');
  assert.equal(loaded.raw, oversized);
  assert.equal(storage.writes.length, 0);
  const empty = memory();
  assert.equal(saveNotebook(empty, KEY, null, JSON.parse(oversized)).ok, false);
  assert.equal(empty.value, null);
  assert.equal(empty.writes.length, 0);
});

test('serialization failures do not write and verification failures do not claim success', () => {
  const circular = emptyNotebook();
  circular.self = circular;
  const storage = memory();
  assert.equal(saveNotebook(storage, KEY, null, circular).reason, 'unavailable');
  assert.equal(storage.writes.length, 0);
  let reads = 0;
  const verifyFailure = {getItem() { if (++reads > 1) throw new Error('Read denied'); return null; }, setItem() {}};
  assert.equal(saveNotebook(verifyFailure, KEY, null, emptyNotebook()).reason, 'unavailable');
});
