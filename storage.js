/* One synchronous, atomic browser record contains current + backup stash.
   No async filesystem flush can be mistaken for a completed extraction save. */
(function (root) {
  'use strict';
  function createStorage(storage, key) {
    let loaded = false, expected = null;
    function raw() {
      if (!loaded) { expected = storage.getItem(key); loaded = true; }
      return expected;
    }
    function decode(text) {
      const data = JSON.parse(text);
      if (!data || data.format !== 1 || typeof data.primary !== 'string' || typeof data.backup !== 'string') throw new Error('Unrecognized browser save');
      return data;
    }
    return {
      key,
      read(backup) {
        try {
          const text = raw(); if (text === null) return '';
          try { const data = decode(text); return backup ? data.backup : data.primary; }
          catch (_) { return backup ? '' : text; }
        } catch (_) { return backup ? '' : '{"browserStorageUnavailable":true}'; }
      },
      write(json, validPrimary) {
        try {
          const old = raw();
          if (storage.getItem(key) !== old) return 'Progress changed in another tab. Reload this tab before starting another raid.';
          let data = {format: 1, primary: '', backup: '', preserved: []};
          if (old !== null) {
            try { data = decode(old); }
            catch (_) { data.preserved = [old]; }
          }
          const preserved = Array.isArray(data.preserved) ? data.preserved.slice() : [];
          if (!validPrimary && data.primary) preserved.push(data.primary);
          const record = JSON.stringify({format: 1, primary: json, backup: validPrimary ? data.primary : data.backup, preserved});
          // setItem either replaces the entire record or throws without changing it.
          storage.setItem(key, record); expected = record;
          return '';
        } catch (_) { return 'Browser storage is unavailable or full. Progress was not saved. Allow site storage and try again.'; }
      },
      export() { return raw(); }
    };
  }
  root.createDeadFreightStorage = createStorage;
  if (typeof module !== 'undefined') module.exports = createStorage;
})(typeof window === 'undefined' ? globalThis : window);
