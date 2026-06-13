/**
 * Ambient Sound — Background sound mixer using Web Audio API
 */
const Ambient = (function() {
    'use strict';

    let audioCtx = null;
    let masterGain = null;
    const sounds = {};

    const SOUND_CONFIG = [
        { id: 'rain',      name: 'Rain',        icon: '🌧️', freq: 'noise',   filterFreq: 800  },
        { id: 'thunder',   name: 'Thunder',     icon: '⛈️', freq: 'noise',   filterFreq: 200  },
        { id: 'wind',      name: 'Wind',        icon: '💨', freq: 'noise',   filterFreq: 400  },
        { id: 'waves',     name: 'Ocean Waves', icon: '🌊', freq: 'noise',   filterFreq: 600  },
        { id: 'fire',      name: 'Fireplace',   icon: '🔥', freq: 'noise',   filterFreq: 1200 },
        { id: 'birds',     name: 'Birds',       icon: '🐦', freq: 'tonal',   baseFreq: 2000   },
        { id: 'coffee',    name: 'Coffee Shop',  icon: '☕', freq: 'noise',   filterFreq: 3000 },
        { id: 'whitenoise',name: 'White Noise',  icon: '📻', freq: 'noise',   filterFreq: 10000},
        { id: 'forest',    name: 'Forest',      icon: '🌲', freq: 'noise',   filterFreq: 1500 },
        { id: 'night',     name: 'Night',       icon: '🌙', freq: 'noise',   filterFreq: 500  },
        { id: 'stream',    name: 'Stream',      icon: '💧', freq: 'noise',   filterFreq: 2500 },
        { id: 'keyboard',  name: 'Keyboard',    icon: '⌨️', freq: 'noise',   filterFreq: 5000 }
    ];

    function init() {
        renderGrid();
        
        // Master volume
        const savedVolume = Storage.get('ambientMasterVolume', 70);
        $('#masterVolume').val(savedVolume);
        
        $('#masterVolume').on('input', function() {
            const vol = parseInt($(this).val());
            if (masterGain) {
                masterGain.gain.value = vol / 100;
            }
            Storage.set('ambientMasterVolume', vol);
        });

        // Sound toggle
        $(document).on('click', '.ambient-card', function(e) {
            if ($(e.target).hasClass('ambient-volume') || $(e.target).is('input')) return;
            const id = $(this).data('sound-id');
            toggleSound(id);
        });

        // Individual volume
        $(document).on('input', '.ambient-volume', function(e) {
            e.stopPropagation();
            const id = $(this).closest('.ambient-card').data('sound-id');
            const vol = parseInt($(this).val());
            if (sounds[id] && sounds[id].gain) {
                sounds[id].gain.gain.value = vol / 100;
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

    function ensureAudioCtx() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = audioCtx.createGain();
            masterGain.gain.value = parseInt($('#masterVolume').val()) / 100;
            masterGain.connect(audioCtx.destination);
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function toggleSound(id) {
        if (sounds[id] && sounds[id].playing) {
            stopSound(id);
        } else {
            startSound(id);
        }
    }

    function startSound(id) {
        ensureAudioCtx();
        
        const cfg = SOUND_CONFIG.find(s => s.id === id);
        if (!cfg) return;

        const $card = $(`.ambient-card[data-sound-id="${id}"]`);
        const volume = parseInt($card.find('.ambient-volume').val()) / 100;

        // Create noise source
        const bufferSize = 2 * audioCtx.sampleRate;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        // Filter for different sound characteristics
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = cfg.filterFreq || 1000;
        filter.Q.value = 0.5;

        // Individual gain
        const gain = audioCtx.createGain();
        gain.gain.value = volume;

        // Connect
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        noise.start();

        // Add subtle modulation for more natural sound
        const lfo = audioCtx.createOscillator();
        const lfoGain = audioCtx.createGain();
        lfo.frequency.value = 0.1 + Math.random() * 0.3;
        lfoGain.gain.value = cfg.filterFreq * 0.2;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        sounds[id] = {
            source: noise,
            filter: filter,
            gain: gain,
            lfo: lfo,
            lfoGain: lfoGain,
            playing: true
        };

        $card.addClass('playing');
    }

    function stopSound(id) {
        if (!sounds[id]) return;

        try {
            sounds[id].source.stop();
            sounds[id].lfo.stop();
            sounds[id].source.disconnect();
            sounds[id].filter.disconnect();
            sounds[id].gain.disconnect();
            sounds[id].lfo.disconnect();
            sounds[id].lfoGain.disconnect();
        } catch(e) {}

        sounds[id].playing = false;
        delete sounds[id];

        $(`.ambient-card[data-sound-id="${id}"]`).removeClass('playing');
    }

    return { init };
})();

$(document).ready(function() {
    Ambient.init();
});
