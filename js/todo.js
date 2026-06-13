/**
 * Todo — Task list with priorities and filters
 */
const Todo = (function() {
    'use strict';

    const STORAGE_KEY = 'todos';
    let todos = [];
    let currentFilter = 'all';

    function init() {
        todos = Storage.get(STORAGE_KEY, []);
        render();
        renderMiniTodo();
        updateDashboardStats();

        // Add form
        $('#todoForm').on('submit', function(e) {
            e.preventDefault();
            const text = $('#todoInput').val().trim();
            const priority = $('#todoPriority').val();
            if (!text) return;

            todos.push({
                id: Date.now(),
                text: text,
                priority: priority,
                completed: false,
                createdAt: new Date().toISOString()
            });
            save();
            render();
            renderMiniTodo();
            updateDashboardStats();
            
            $('#todoInput').val('').focus();
            showToast('Task ditambahkan!');
        });

        // Filters
        $(document).on('click', '.filter-btn', function() {
            currentFilter = $(this).data('filter');
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            render();
        });

        // Toggle complete
        $(document).on('click', '.todo-checkbox', function() {
            const id = $(this).closest('.todo-item').data('id');
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                save();
                render();
                renderMiniTodo();
                updateDashboardStats();
            }
        });

        // Delete
        $(document).on('click', '.todo-delete', function() {
            const id = $(this).closest('.todo-item').data('id');
            todos = todos.filter(t => t.id !== id);
            save();
            render();
            renderMiniTodo();
            updateDashboardStats();
        });

        // Clear completed
        $('#clearCompleted').on('click', function() {
            const count = todos.filter(t => t.completed).length;
            if (count === 0) return;
            if (confirm(`Hapus ${count} task yang sudah selesai?`)) {
                todos = todos.filter(t => !t.completed);
                save();
                render();
                renderMiniTodo();
                updateDashboardStats();
                showToast('Task selesai dihapus.');
            }
        });
    }

    function render() {
        const $list = $('#todoList');
        $list.empty();

        let filtered = todos;
        if (currentFilter === 'active') filtered = todos.filter(t => !t.completed);
        if (currentFilter === 'completed') filtered = todos.filter(t => t.completed);

        if (filtered.length === 0) {
            const msg = currentFilter === 'all' ? 'Belum ada task. Mulai tambahkan!' : 
                        currentFilter === 'active' ? 'Tidak ada task aktif.' : 'Tidak ada task selesai.';
            $list.html(`<p class="text-muted-custom text-center py-4">${msg}</p>`);
        } else {
            filtered.forEach(function(todo) {
                const checked = todo.completed ? 'checked' : '';
                const completed = todo.completed ? 'completed' : '';
                const priorityClass = `priority-${todo.priority}`;
                const priorityLabel = { high: 'High', medium: 'Med', low: 'Low' }[todo.priority];

                $list.append(`
                    <div class="todo-item ${completed}" data-id="${todo.id}">
                        <div class="todo-checkbox ${checked}"><i class="bi bi-check2"></i></div>
                        <span class="todo-text">${$('<span>').text(todo.text).html()}</span>
                        <span class="todo-priority ${priorityClass}">${priorityLabel}</span>
                        <button class="todo-delete"><i class="bi bi-x-lg"></i></button>
                    </div>
                `);
            });
        }

        const remaining = todos.filter(t => !t.completed).length;
        $('#todoCount').text(`${remaining} task tersisa`);
    }

    function renderMiniTodo() {
        const $mini = $('#miniTodoList');
        $mini.empty();
        const active = todos.filter(t => !t.completed).slice(0, 5);

        if (active.length === 0) {
            $mini.html('<p class="text-muted-custom">Belum ada task. Tambahkan di halaman Todo.</p>');
            return;
        }

        active.forEach(function(todo) {
            $mini.append(`
                <div class="mini-todo-item" data-id="${todo.id}">
                    <div class="mini-todo-check"><i class="bi bi-check2"></i></div>
                    <span>${$('<span>').text(todo.text).html()}</span>
                </div>
            `);
        });

        // Mini todo check
        $mini.find('.mini-todo-check').on('click', function() {
            const id = $(this).closest('.mini-todo-item').data('id');
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = true;
                save();
                render();
                renderMiniTodo();
                updateDashboardStats();
            }
        });
    }

    function updateDashboardStats() {
        const done = todos.filter(t => t.completed).length;
        $('#statTasksDone').text(done);
    }

    function save() {
        Storage.set(STORAGE_KEY, todos);
    }

    return { init };
})();

$(document).ready(function() {
    Todo.init();
});
