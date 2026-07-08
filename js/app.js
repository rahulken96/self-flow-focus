/**
 * App — Sidebar navigation, theme toggle, top bar clock
 */
const App = (function() {
    'use strict';

    function init() {
        initTheme();
        initSidebar();
        initClock();
        initSettingsPage();
        bindCardLinks();
    }

    // ── Theme ──
    function initTheme() {
        const saved = Storage.get('theme', 'light');
        applyTheme(saved);

        $('#themeToggle').on('click', function() {
            const current = $('html').attr('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            applyTheme(next);
            Storage.set('theme', next);
        });
    }

    function applyTheme(theme) {
        $('html').attr('data-theme', theme);
        if (theme === 'dark') {
            $('#themeIcon').removeClass('bi-sun-fill').addClass('bi-moon-stars-fill');
            $('#themeLabel').text('Dark Mode');
        } else {
            $('#themeIcon').removeClass('bi-moon-stars-fill').addClass('bi-sun-fill');
            $('#themeLabel').text('Light Mode');
        }
    }

    // ── Sidebar Navigation ──
    function initSidebar() {
        // Page navigation
        $('.nav-link[data-page]').on('click', function(e) {
            e.preventDefault();
            const page = $(this).data('page');
            navigateTo(page);
        });

    // Mobile toggle
        $('#mobileSidebarToggle').on('click', function() {
            $('#sidebar').addClass('active');
            $('#sidebarOverlay').addClass('active');
        });

        $('#sidebarOverlay').on('click', function() {
            $('#sidebar').removeClass('active');
            $(this).removeClass('active');
        });

        // Desktop sidebar collapse toggle
        $('#sidebarToggle').on('click', function() {
            const $sidebar = $('#sidebar');
            const $main = $('#mainContent');
            const collapsed = $sidebar.hasClass('collapsed');
            if (collapsed) {
                $sidebar.removeClass('collapsed');
                $main.css('margin-left', '260px');
            } else {
                $sidebar.addClass('collapsed');
                $main.css('margin-left', '60px');
            }
        });


        // Load last page
        const lastPage = Storage.get('currentPage', 'dashboard');
        navigateTo(lastPage);
    }

    function navigateTo(page) {
        // Update nav
        $('.nav-link').removeClass('active');
        $(`.nav-link[data-page="${page}"]`).addClass('active');

        // Update page
        $('.page-content').removeClass('active');
        $(`#page-${page}`).addClass('active');

        // Update title
        const titles = {
            'dashboard': 'Dashboard',
            'pomodoro': 'Pomodoro Timer',
            'session-log': 'Session Log',
            'todo': 'Todo List',
            'kanban': 'Kanban Board',
            'eisenhower': 'Eisenhower Matrix',
            'sticky-notes': 'Sticky Notes',
            'quotes': 'Daily Quote',
            'habits': 'Habit Tracker',
            'ambient': 'Ambient Sound',
            'calculator': 'Kalkulator & Kurs',
            'settings': 'Settings & Data'
        };
        $('#pageTitle').text(titles[page] || 'Dashboard');

        // Save
        Storage.set('currentPage', page);

        // Close mobile sidebar
        $('#sidebar').removeClass('active');
        $('#sidebarOverlay').removeClass('active');
    }

    // Expose for other modules
    window.navigateTo = navigateTo;

    // ── Clock ──
    function initClock() {
        updateClock();
        setInterval(updateClock, 1000);
    }

    function updateClock() {
        const now = new Date();
        const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
        const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
        
        $('#currentDate').text(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
        $('#currentTime').text(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }

    // ── Card Links ──
    function bindCardLinks() {
        $(document).on('click', '.card-link[data-page]', function(e) {
            e.preventDefault();
            navigateTo($(this).data('page'));
        });
    }

    // ── Settings Page ──
    function initSettingsPage() {
        $('#exportData').on('click', function() {
            Storage.exportAll();
            showToast('Data berhasil di-export!');
        });

        $('#importFile').on('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(ev) {
                const result = Storage.importAll(ev.target.result);
                if (result.success) {
                    $('#importStatus').html(`<div class="alert alert-success">${result.message} Halaman akan refresh...</div>`);
                    setTimeout(() => location.reload(), 1500);
                } else {
                    $('#importStatus').html(`<div class="alert alert-danger">${result.message}</div>`);
                }
            };
            reader.readAsText(file);
            $(this).val(''); // reset
        });

        $('#resetAllData').on('click', function() {
            if (confirm('⚠️ PERINGATAN: Semua data WorkFlow akan dihapus permanen!\n\nApakah kamu yakin?')) {
                if (confirm('Ini adalah konfirmasi terakhir. Lanjutkan menghapus SEMUA data?')) {
                    Storage.resetAll();
                    showToast('Semua data telah dihapus.');
                    setTimeout(() => location.reload(), 1000);
                }
            }
        });
    }

    return { init, navigateTo };
})();

// ── Toast Notification ──
function showToast(message, duration) {
    duration = duration || 3000;
    $('#wfToastBody').text(message);
    const toast = new bootstrap.Toast($('#wfToast')[0], { delay: duration });
    toast.show();
}

// ── Init ──
$(document).ready(function() {
    App.init();
});
