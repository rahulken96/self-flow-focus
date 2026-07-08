/**
 * Ambient Sound — Background sound mixer using HTML5 Audio
 */
const Ambient = (function() {
    'use strict';

    const sounds = {};

    const SOUND_CONFIG = [
        { id: 'rain',      name: 'Rain',        icon: '🌧️',  url: 'https://raw.githubusercontent.com/karthiknvd/noctune/master/sounds/rain.mp3' },
        { id: 'thunder',   name: 'Thunder',     icon: '⛈️',  url: 'https://raw.githubusercontent.com/karthiknvd/noctune/master/sounds/thunder.mp3' },
        { id: 'wind',      name: 'Wind',        icon: '💨',  url: 'https://raw.githubusercontent.com/karthiknvd/noctune/master/sounds/wind.mp3' },
        { id: 'waves',     name: 'Ocean Waves', icon: '🌊',  url: 'https://raw.githubusercontent.com/karthiknvd/noctune/master/sounds/river.mp3' },
        { id: 'fire',      name: 'Fireplace',   icon: '🔥',  url: 'https://raw.githubusercontent.com/karthiknvd/noctune/master/sounds/campfire.mp3' },
        { id: 'birds',     name: 'Birds',       icon: '🐦',  url: 'https://www.soundjay.com/nature/sounds/birds-chirping-1.mp3' },
        { id: 'coffee',    name: 'Coffee Shop', icon: '☕',  url: 'https://www.soundjay.com/human/sounds/cafe-ambience-1.mp3' },
        { id: 'whitenoise',name: 'White Noise', icon: '📻',  url: 'https://bigsoundbank.com/UPLOAD/mp3/1037.mp3' },
        { id: 'forest',    name: 'Forest',      icon: '🌲',  url: 'https://raw.githubusercontent.com/karthiknvd/noctune/master/sounds/forest.mp3' },
        { id: 'night',     name: 'Night',       icon: '🌙',  url: 'https://raw.githubusercontent.com/karthiknvd/noctune/master/sounds/night.mp3' },
        { id: 'stream',    name: 'Stream',      icon: '💧',  url: 'https://www.soundjay.com/nature/sounds/water-stream-1.mp3' },
        { id: 'keyboard',  name: 'Keyboard',    icon: '⌨️',  url: 'https://www.soundjay.com/communication/sounds/keyboard-typing-1.mp3' }
    ];

    function init() {
        renderGrid();
        
        const savedVolume = Storage.get('ambientMasterVolume', 70);
        $('#masterVolume').val(savedVolume);
        
        $('#masterVolume').on('input', function() {
            const vol = parseInt($(this).val());
            Object.values(sounds).forEach(audio => { audio.volume = vol / 100; });
            Storage.set('ambientMasterVolume', vol);
        });

        $(document).on('click', '.ambient-card', function(e) {
            if ($(e.target).is('input')) return;
            const id = $(this).data('sound-id');
            toggleSound(id);
        });

        $(document).on('input', '.ambient-volume', function(e) {
            e.stopPropagation();
            const id = $(this).closest('.ambient-card').data('sound-id');
            const vol = parseInt($(this).val());
            if (sounds[id]) {
                sounds[id].volume = vol / 100;
            }
        });
    }

    function renderGrid() {
        const $grid = $('#ambientGrid');
        $grid.empty();
        SOUND_CONFIG.forEach(function(cfg) {
            $grid.append(`
                <div class="ambient-card" data-sound-id="${cfg.id}">
                    <span class="ambient-card-icon">${cfg.icon}</span>
                    <span class="ambient-card-name">${cfg.name}</span>
                    <input type="range" class="ambient-volume wf-range" min="0" max="100" value="60" title="Volume">
                </div>
            `);
        });
    }

    function toggleSound(id) {
        if (sounds[id]) {
            stopSound(id);
        } else {
            startSound(id);
        }
    }

    function startSound(id) {
        const cfg = SOUND_CONFIG.find(s => s.id === id);
        if (!cfg) return;

        const volume = parseInt($(`.ambient-card[data-sound-id="${id}"] .ambient-volume`).val()) / 100;
        const audio = new Audio(cfg.url);
        audio.loop = true;
        audio.volume = volume;
        audio.play().catch(e => console.error("Playback failed:", e));

        sounds[id] = audio;
        $(`.ambient-card[data-sound-id="${id}"]`).addClass('playing');
    }

    function stopSound(id) {
        const audio = sounds[id];
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            delete sounds[id];
            $(`.ambient-card[data-sound-id="${id}"]`).removeClass('playing');
        }
    }

    return { init };
})();

$(document).ready(function() {
    Ambient.init();
});
