/**
 * Pomodoro Timer — Focus timer with configurable intervals
 */
const Pomodoro = (function() {
    'use strict';

    const CIRCUMFERENCE = 2 * Math.PI * 90; // timer ring circumference

    let timer = null;
    let timeLeft = 25 * 60;
    let totalTime = 25 * 60;
    let isRunning = false;
    let currentMode = 'work'; // work | short | long
    let sessionsCompleted = 0;

    const settings = {
        work: 25,
        short: 5,
        long: 15,
        longAfter: 4,
        autoSwitch: true,
        sound: true
    };

    function init() {
        loadSettings();
        loadSessionCount();
        updateDisplay();
        updateProgress();

        // Mode buttons
        $('.pomo-mode-btn').on('click', function() {
            if (isRunning) return;
            const mode = $(this).data('mode');
            switchMode(mode);
        });

        // Start/Pause
        $('#timerStartPause').on('click', toggleTimer);
        $('#miniTimerStart').on('click', toggleTimer);

        // Reset
        $('#timerReset').on('click', resetTimer);
        $('#miniTimerReset').on('click', resetTimer);

        // Settings inputs
        $('#settingWork').on('change', function() { settings.work = parseInt($(this).val()) || 25; saveSettings(); if (currentMode === 'work' && !isRunning) resetTimer(); });
        $('#settingShort').on('change', function() { settings.short = parseInt($(this).val()) || 5; saveSettings(); if (currentMode === 'short' && !isRunning) resetTimer(); });
        $('#settingLong').on('change', function() { settings.long = parseInt($(this).val()) || 15; saveSettings(); if (currentMode === 'long' && !isRunning) resetTimer(); });
        $('#settingLongAfter').on('change', function() { settings.longAfter = parseInt($(this).val()) || 4; saveSettings(); });
        $('#settingAutoSwitch').on('change', function() { settings.autoSwitch = $(this).prop('checked'); saveSettings(); });
        $('#settingSound').on('change', function() { settings.sound = $(this).prop('checked'); saveSettings(); });

        // Set initial ring
        $('#timerProgress').css('stroke-dasharray', CIRCUMFERENCE);
    }

    function switchMode(mode) {
        currentMode = mode;
        $('.pomo-mode-btn').removeClass('active');
        $(`.pomo-mode-btn[data-mode="${mode}"]`).addClass('active');

        const labels = { work: 'Focus Time', short: 'Short Break', long: 'Long Break' };
        $('#timerLabel').text(labels[mode]);

        totalTime = settings[mode] * 60;
        timeLeft = totalTime;
        updateDisplay();
        updateProgress();
    }

    function toggleTimer() {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }

    function startTimer() {
        isRunning = true;
        $('#timerStartPause').html('<i class="bi bi-pause-fill"></i> Pause');
        $('#miniTimerStart').html('<i class="bi bi-pause-fill"></i> Pause');

        timer = setInterval(function() {
            timeLeft--;
            updateDisplay();
            updateProgress();

            if (timeLeft <= 0) {
                completeSession();
            }
        }, 1000);
    }

    function pauseTimer() {
        isRunning = false;
        clearInterval(timer);
        timer = null;
        $('#timerStartPause').html('<i class="bi bi-play-fill"></i> Start');
        $('#miniTimerStart').html('<i class="bi bi-play-fill"></i> Start');
    }

    function resetTimer() {
        pauseTimer();
        totalTime = settings[currentMode] * 60;
        timeLeft = totalTime;
        updateDisplay();
        updateProgress();
    }

    function completeSession() {
        pauseTimer();

        if (settings.sound) {
            playNotification();
        }

        if (currentMode === 'work') {
            sessionsCompleted++;
            saveSessionCount();
            updateDashboardStats();

            // Log session
            const label = $('#sessionLabel').val() || 'Focus Session';
            if (typeof SessionLog !== 'undefined') {
                SessionLog.addSession({
                    timestamp: new Date().toISOString(),
                    label: label,
                    duration: settings.work,
                    type: 'focus'
                });
            }

            showToast(`🎉 Sesi fokus selesai! (${sessionsCompleted} hari ini)`);

            // Auto switch to break
            if (settings.autoSwitch) {
                if (sessionsCompleted % settings.longAfter === 0) {
                    switchMode('long');
                } else {
                    switchMode('short');
                }
                startTimer();
            }
        } else {
            showToast('☕ Break selesai! Waktunya fokus lagi.');
            if (settings.autoSwitch) {
                switchMode('work');
                startTimer();
            }
        }
    }

    function updateDisplay() {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        
        $('#timerDisplay').text(display);
        $('#miniTimerDisplay').text(display);
        document.title = isRunning ? `${display} — WorkFlow` : 'WorkFlow — Productivity Dashboard';
    }

    function updateProgress() {
        const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
        const offset = CIRCUMFERENCE * (1 - progress);
        $('#timerProgress').css('stroke-dashoffset', offset);
    }

    function playNotification() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.value = 800;
            osc.type = 'sine';
            gain.gain.value = 0.3;
            
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc.stop(ctx.currentTime + 0.5);

            setTimeout(() => {
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.frequency.value = 1000;
                osc2.type = 'sine';
                gain2.gain.value = 0.3;
                osc2.start();
                gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                osc2.stop(ctx.currentTime + 0.5);
            }, 300);
        } catch(e) {}
    }

    function loadSettings() {
        const saved = Storage.get('pomoSettings', null);
        if (saved) {
            Object.assign(settings, saved);
        }
        $('#settingWork').val(settings.work);
        $('#settingShort').val(settings.short);
        $('#settingLong').val(settings.long);
        $('#settingLongAfter').val(settings.longAfter);
        $('#settingAutoSwitch').prop('checked', settings.autoSwitch);
        $('#settingSound').prop('checked', settings.sound);

        totalTime = settings[currentMode] * 60;
        timeLeft = totalTime;
    }

    function saveSettings() {
        Storage.set('pomoSettings', settings);
    }

    function loadSessionCount() {
        const today = new Date().toDateString();
        const saved = Storage.get('pomoSessions', { date: '', count: 0 });
        if (saved.date === today) {
            sessionsCompleted = saved.count;
        } else {
            sessionsCompleted = 0;
        }
        $('#pomoCount').text(sessionsCompleted);
        updateDashboardStats();
    }

    function saveSessionCount() {
        Storage.set('pomoSessions', { date: new Date().toDateString(), count: sessionsCompleted });
        $('#pomoCount').text(sessionsCompleted);
    }

    function updateDashboardStats() {
        $('#statPomodoros').text(sessionsCompleted);
        const focusMins = sessionsCompleted * settings.work;
        if (focusMins >= 60) {
            $('#statFocusTime').text(Math.floor(focusMins / 60) + 'h ' + (focusMins % 60) + 'm');
        } else {
            $('#statFocusTime').text(focusMins + 'm');
        }
    }

    function getSessionsCompleted() { return sessionsCompleted; }

    return { init, getSessionsCompleted };
})();

$(document).ready(function() {
    Pomodoro.init();
});
