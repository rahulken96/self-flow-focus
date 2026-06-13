/**
 * Habits — Daily habit tracker with 7-day view and streaks
 */
const Habits = (function() {
    'use strict';

    const STORAGE_KEY = 'habits';
    let habits = [];

    function init() {
        habits = Storage.get(STORAGE_KEY, []);
        renderWeekHeader();
        render();
        updateDashboardStreak();

        // Add habit
        $('#addHabit').on('click', function() {
            $('#habitName').val('');
            $('#habitIcon').val('💪');
            new bootstrap.Modal('#habitModal').show();
        });

        // Save habit
        $('#saveHabit').on('click', function() {
            const name = $('#habitName').val().trim();
            if (!name) return;

            const icon = $('#habitIcon').val();
            habits.push({
                id: Date.now(),
                name: name,
                icon: icon,
                checks: {} // { 'YYYY-MM-DD': true }
            });

            save();
            render();
            bootstrap.Modal.getInstance($('#habitModal')[0]).hide();
            showToast('Habit ditambahkan!');
        });

        // Toggle check
        $(document).on('click', '.habit-check', function() {
            const habitId = $(this).closest('.habit-row').data('habit-id');
            const date = $(this).data('date');
            const habit = habits.find(h => h.id === habitId);
            
            if (habit) {
                if (habit.checks[date]) {
                    delete habit.checks[date];
                } else {
                    habit.checks[date] = true;
                }
                save();
                render();
                updateDashboardStreak();
            }
        });

        // Delete habit
        $(document).on('click', '.habit-delete', function() {
            const id = $(this).closest('.habit-row').data('habit-id');
            if (confirm('Hapus habit ini?')) {
                habits = habits.filter(h => h.id !== id);
                save();
                render();
                updateDashboardStreak();
                showToast('Habit dihapus.');
            }
        });
    }

    function getWeekDates() {
        const dates = [];
        const today = new Date();
        // Start from 6 days ago to today
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            dates.push(d);
        }
        return dates;
    }

    function formatDate(d) {
        return d.toISOString().slice(0, 10);
    }

    function renderWeekHeader() {
        const $header = $('#habitWeekHeader');
        $header.empty();

        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const today = new Date().toDateString();
        const weekDates = getWeekDates();

        $header.append('<div class="habit-day-label" style="text-align:left;">Habit</div>');
        weekDates.forEach(function(d) {
            const isToday = d.toDateString() === today;
            const dayLabel = days[d.getDay()];
            const dateNum = d.getDate();
            $header.append(`<div class="habit-day-label ${isToday ? 'today' : ''}">${dayLabel}<br><small>${dateNum}</small></div>`);
        });
        $header.append('<div class="habit-day-label">🔥 Streak</div>');
    }

    function render() {
        const $list = $('#habitList');
        $list.empty();

        if (habits.length === 0) {
            $list.html('<p class="text-muted-custom text-center py-4">Belum ada habit. Mulai tracking kebiasaan baikmu!</p>');
            return;
        }

        const weekDates = getWeekDates();

        habits.forEach(function(habit) {
            let $row = $(`<div class="habit-row" data-habit-id="${habit.id}"></div>`);
            
            // Name
            $row.append(`
                <div class="habit-name">
                    <span class="habit-icon">${habit.icon}</span>
                    <span>${$('<span>').text(habit.name).html()}</span>
                </div>
            `);

            // Week checks
            weekDates.forEach(function(d) {
                const dateKey = formatDate(d);
                const checked = habit.checks[dateKey] ? 'checked' : '';
                $row.append(`
                    <div class="habit-check-cell">
                        <div class="habit-check ${checked}" data-date="${dateKey}">
                            <i class="bi bi-check2"></i>
                        </div>
                    </div>
                `);
            });

            // Streak
            const streak = calculateStreak(habit);
            $row.append(`
                <div class="habit-streak">
                    <i class="bi bi-fire"></i> ${streak}
                    <button class="habit-delete ms-1"><i class="bi bi-trash3"></i></button>
                </div>
            `);

            $list.append($row);
        });
    }

    function calculateStreak(habit) {
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = formatDate(d);
            
            if (habit.checks[key]) {
                streak++;
            } else {
                // Allow today to be unchecked (day not over yet)
                if (i === 0) continue;
                break;
            }
        }
        
        return streak;
    }

    function updateDashboardStreak() {
        let maxStreak = 0;
        habits.forEach(function(h) {
            const s = calculateStreak(h);
            if (s > maxStreak) maxStreak = s;
        });
        $('#statStreak').text(maxStreak);
    }

    function save() {
        Storage.set(STORAGE_KEY, habits);
    }

    return { init };
})();

$(document).ready(function() {
    Habits.init();
});
