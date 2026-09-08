/* One synchronous, atomic browser record contains current + backup stash.
   No async filesystem flush can be mistaken for a completed extraction save. */
(function (root) {
  'use strict';
  const limits = {salvage:100000000,extractions:100000000,manifests:100000000,medicalBag:1,ammoRig:1,contractsCompleted:100000000,ironworksClears:100000000,prototypeCores:100000000,stabilizer:1,overdrive:1,equippedMod:2,guideMode:2,utilityChoice:2,smokeUnlocked:1,utilityRig:1,depotBlueprints:100000000,campaignStage:3,quietKit:1,loaderKit:1,sorterKit:1,equippedKit:3,prototypeRecipes:7};
  function inspectBackup(text) {
    if (typeof text !== 'string' || text.length > 1048576) throw Error('Choose a stash backup smaller than 1 MB.');
    let data;
    try { data=JSON.parse(text); } catch (_) { throw Error('This file is not valid JSON. Your current stash is unchanged.'); }
    if (data && Object.hasOwn(data,'format')) {
      if (data.format!==1 || typeof data.primary!=='string') throw Error('Unsupported browser backup format.');
      text=data.primary;
      try { data=JSON.parse(text); } catch (_) { throw Error('The backup has an unreadable primary stash.'); }
    }
    if (!data || Array.isArray(data) || ![1,2].includes(data.version)) throw Error('This game can restore stash version 1 or 2.');
    if (!Array.isArray(data.weapons) || data.weapons.length!==(data.version===1?5:8) || data.weapons.some(n=>!Number.isInteger(n)||n<0||n>999)) throw Error('The weapon counts must match the stash version (five legacy or eight current).');
    for (const [key,value] of Object.entries(data)) {
      if (key==='version'||key==='weapons') continue;
      if (!Object.hasOwn(limits,key)) throw Error('The backup contains an unsupported field: '+key+'. Use its original game version.');
      if (!Number.isInteger(value)||value<0||value>limits[key]) throw Error('Invalid value for '+key+'. Your current stash is unchanged.');
    }
    const n=key=>data[key]||0;
    if(data.version===1&&n('prototypeRecipes')) throw Error('A legacy stash cannot contain prototype recipes.');
    if (n('quietKit')&&n('campaignStage')<1||n('loaderKit')&&n('campaignStage')<2||n('sorterKit')&&n('campaignStage')<3||n('equippedKit')&&!n(['','quietKit','loaderKit','sorterKit'][n('equippedKit')])||n('equippedMod')&&!n(['','stabilizer','overdrive'][n('equippedMod')])||n('utilityChoice')===2&&!n('smokeUnlocked')) throw Error('The backup has inconsistent equipment unlocks.');
    return {json:text,version:data.version,prototypeRecipes:n('prototypeRecipes'),salvage:n('salvage'),extractions:n('extractions'),campaignStage:n('campaignStage'),weapons:data.weapons.slice()};
  }
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
      export() { return raw(); },
      previewBackup(text) { raw(); return inspectBackup(text); },
      importBackup(text) {
        const incoming=inspectBackup(text);
        const old=raw();
        if (storage.getItem(key)!==old) throw Error('Progress changed in another tab. Reload before restoring a backup.');
        let previous={primary:'',backup:'',preserved:[]};
        if(old!==null){try{previous=decode(old);}catch(_){previous.preserved=[old];}}
        const preserved=Array.isArray(previous.preserved)?previous.preserved.slice():[];
        let backup=previous.backup;
        if(previous.primary){try{inspectBackup(previous.primary);backup=previous.primary;}catch(_){preserved.push(previous.primary);}}
        const record=JSON.stringify({format:1,primary:incoming.json,backup,preserved});
        try{storage.setItem(key,record);}catch(_){throw Error('Restore failed because browser storage is unavailable or full. Your current stash is unchanged.');}
        expected=record;return incoming;
      }
    };
  }
  root.createDeadFreightStorage = createStorage;
  if (typeof module !== 'undefined') module.exports = createStorage;
})(typeof window === 'undefined' ? globalThis : window);
