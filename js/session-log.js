/**
 * Session Log — Record and display completed pomodoro sessions
 */
const SessionLog = (function() {
    'use strict';

    const STORAGE_KEY = 'sessionLog';
    let sessions = [];

    function init() {
        sessions = Storage.get(STORAGE_KEY, []);
        render();

        $('#clearSessionLog').on('click', function() {
            if (confirm('Hapus semua riwayat sesi?')) {
                sessions = [];
                save();
                render();
                showToast('Riwayat sesi dihapus.');
            }
        });
    }

    function addSession(session) {
        sessions.unshift(session);
        save();
        render();
    }

    function render() {
        const today = new Date().toDateString();
        const todaySessions = sessions.filter(s => new Date(s.timestamp).toDateString() === today);

        // Summary
        const totalSessions = todaySessions.length;
        const totalFocus = todaySessions.reduce((acc, s) => acc + (s.duration || 0), 0);
        const avgSession = totalSessions > 0 ? Math.round(totalFocus / totalSessions) : 0;

        $('#logTotalSessions').text(totalSessions);
        $('#logTotalFocus').text(totalFocus >= 60 ? Math.floor(totalFocus/60) + 'h ' + (totalFocus%60) + 'm' : totalFocus + 'm');
        $('#logAvgSession').text(avgSession + 'm');

        // Table
        const $body = $('#sessionLogBody');
        $body.empty();

        if (sessions.length === 0) {
            $body.html('<tr><td colspan="4" class="text-center text-muted-custom">Belum ada sesi tercatat.</td></tr>');
            return;
        }

        sessions.slice(0, 50).forEach(function(s) {
            const time = new Date(s.timestamp);
            const timeStr = time.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' ' + 
                           time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            const typeLabel = s.type === 'focus' ? '<span class="todo-priority priority-high">Focus</span>' : '<span class="todo-priority priority-low">Break</span>';

            $body.append(`
                <tr>
                    <td>${timeStr}</td>
                    <td>${$('<span>').text(s.label).html()}</td>
                    <td>${s.duration}m</td>
                    <td>${typeLabel}</td>
                </tr>
            `);
        });
    }

    function save() {
        Storage.set(STORAGE_KEY, sessions);
    }

    return { init, addSession };
})();

$(document).ready(function() {
    SessionLog.init();
});
