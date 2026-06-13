/**
 * Storage — localStorage wrapper with import/export
 */
const Storage = (function() {
    'use strict';

    const PREFIX = 'wf_';

    function get(key, defaultVal) {
        try {
            const data = localStorage.getItem(PREFIX + key);
            return data ? JSON.parse(data) : defaultVal;
        } catch(e) {
            return defaultVal;
        }
    }

    function set(key, value) {
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(value));
        } catch(e) {
            console.error('Storage save error:', e);
        }
    }

    function remove(key) {
        localStorage.removeItem(PREFIX + key);
    }

    function getAllKeys() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(PREFIX)) {
                keys.push(key);
            }
        }
        return keys;
    }

    function exportAll() {
        const data = {};
        getAllKeys().forEach(key => {
            data[key] = localStorage.getItem(key);
        });
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `workflow_backup_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return true;
    }

    function importAll(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            // Validate it's our data
            const keys = Object.keys(data);
            const validKeys = keys.filter(k => k.startsWith(PREFIX));
            
            if (validKeys.length === 0) {
                return { success: false, message: 'File tidak berisi data WorkFlow yang valid.' };
            }

            // Clear existing
            getAllKeys().forEach(key => localStorage.removeItem(key));

            // Import
            validKeys.forEach(key => {
                localStorage.setItem(key, data[key]);
            });

            return { success: true, message: `Berhasil import ${validKeys.length} item data.` };
        } catch(e) {
            return { success: false, message: 'Format file tidak valid: ' + e.message };
        }
    }

    function resetAll() {
        getAllKeys().forEach(key => localStorage.removeItem(key));
    }

    return { get, set, remove, exportAll, importAll, resetAll };
})();
