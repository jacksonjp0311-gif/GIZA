import type {Notebook} from './model';

/** Keep persisted notebooks compatible with the existing JSON import limit. */
export const MAX_NOTEBOOK_BYTES = 2_000_000;
export type NotebookStorage = Pick<Storage, 'getItem' | 'setItem'>;
export type NotebookBaseline = string | null | undefined;
export type NotebookLoad = {
  notebook: Notebook;
  /** undefined deliberately blocks saving after an unreadable/unavailable load. */
  baseline: NotebookBaseline;
  /** Original bytes are retained for a user-requested backup, never repaired in place. */
  raw: string | null;
  state: 'ready' | 'unreadable' | 'unavailable';
  message: string;
};
export type NotebookSave =
  | {ok: true; baseline: string}
  | {ok: false; reason: 'conflict' | 'unavailable'; message: string};

const blank = (): Notebook => ({schema: 'giza.epigraphy.v1', artifact: 'sphinx.dream-stela', regions: []});
const byteLength = (value: string): number => new TextEncoder().encode(value).byteLength;
const unavailable = (message: string): NotebookSave => ({ok: false, reason: 'unavailable', message});
const conflict = (): NotebookSave => ({
  ok: false,
  reason: 'conflict',
  message: 'The stored notebook changed in another tab or window. Your current draft has not been merged. Export your draft before loading the stored copy.',
});

/** Read-only: a failed parse never writes an empty notebook over the original. */
export function loadNotebook(
  storage: NotebookStorage | null | undefined,
  key: string,
  parse: (value: unknown) => Notebook,
): NotebookLoad {
  const blocked = (state: 'unreadable' | 'unavailable', raw: string | null, message: string): NotebookLoad =>
    ({notebook: blank(), baseline: undefined, raw, state, message});
  if (!storage) return blocked('unavailable', null, 'Browser storage is unavailable. This draft is not being saved; export a backup before closing.');
  let raw: string | null;
  try {
    raw = storage.getItem(key);
  } catch {
    return blocked('unavailable', null, 'Browser storage could not be read. This draft is not being saved; export a backup before closing.');
  }
  if (raw === null) return {notebook: blank(), baseline: null, raw, state: 'ready', message: ''};
  try {
    if (byteLength(raw) > MAX_NOTEBOOK_BYTES) {
      return blocked('unreadable', raw, 'The stored notebook exceeds the 2 MB limit. Its original content is preserved. Back it up before attempting recovery.');
    }
    return {notebook: parse(JSON.parse(raw)), baseline: raw, raw, state: 'ready', message: ''};
  } catch {
    return blocked('unreadable', raw, 'The stored notebook could not be read as a supported notebook. Its original content is preserved; automatic saving is paused. Back up the stored copy before attempting recovery.');
  }
}

/**
 * Optimistic stale-write protection, not a transaction or a cross-tab lock.
 * Compare immediately before writing and verify immediately afterward. A later
 * storage event must still be handled by the UI. localStorage has no atomic
 * compare-and-swap, so truly simultaneous writes cannot be guaranteed conflict-free.
 * Keep an in-memory draft and provide export/reload rather than an overwrite button.
 */
export function saveNotebook(
  storage: NotebookStorage | null | undefined,
  key: string,
  baseline: NotebookBaseline,
  next: Notebook,
): NotebookSave {
  if (baseline === undefined) return unavailable('Saving is paused because the stored notebook was not safely loaded. Export your draft and reload or recover the stored copy first.');
  if (!storage) return unavailable('Browser storage is unavailable. Export your draft before closing.');
  let serialized: string;
  try {
    serialized = JSON.stringify(next);
    if (typeof serialized !== 'string' || byteLength(serialized) > MAX_NOTEBOOK_BYTES) {
      return unavailable('This notebook exceeds the 2 MB save limit. The stored copy was not changed. Export your draft before reducing its size.');
    }
  } catch {
    return unavailable('This draft could not be serialized. The stored copy was not changed; keep this window open while recovering your draft.');
  }
  try {
    if (storage.getItem(key) !== baseline) return conflict();
    // Do not perform another write when a validated save already has identical bytes.
    if (serialized !== baseline) storage.setItem(key, serialized);
    if (storage.getItem(key) !== serialized) return conflict();
    return {ok: true, baseline: serialized};
  } catch {
    return unavailable('The browser could not save or verify this draft (storage may be full or blocked). Export your draft before closing; do not assume it was saved.');
  }
}
