import { localStorageService } from './storage';
/* ==================================================================================
 * cache 所有的存储
 * ==================================================================================
 */

const STORAGE = localStorageService;
const COLLECT_KEY = '__toast__';
const LINE_KEY = '__toast_line__';

export function saveCollect(bool) {
  let toast = STORAGE.get(COLLECT_KEY, bool);
  STORAGE.set(COLLECT_KEY, toast);
  return toast;
}

export function loadCollect() {
  return STORAGE.get(COLLECT_KEY, true);
}

export function saveToastLine(bool) {
  let toast = STORAGE.get(LINE_KEY, bool);
  STORAGE.set(LINE_KEY, toast);
  return toast;
}

export function loadToastLine() {
  return STORAGE.get(LINE_KEY, true);
}
