/**
 * Eisenhower Matrix — Priority quadrant system
 */
const Eisenhower = (function() {
    'use strict';

    const STORAGE_KEY = 'eisenhowerTasks';
    let tasks = [];
    let editingId = null;

    function init() {
        tasks = Storage.get(STORAGE_KEY, []);
        render();

        // Add task
        $('#addEisenhowerTask').on('click', function() {
            editingId = null;
            $('#eqTaskTitle').val('');
            $('#eqTaskQuadrant').val('do');
            $('#eqTaskId').val('');
            new bootstrap.Modal('#eisenhowerModal').show();
        });

        // Save
        $('#saveEqTask').on('click', function() {
            const title = $('#eqTaskTitle').val().trim();
            if (!title) return;

            const quadrant = $('#eqTaskQuadrant').val();

            if (editingId) {
                const task = tasks.find(t => t.id === editingId);
                if (task) {
                    task.title = title;
                    task.quadrant = quadrant;
                }
            } else {
                tasks.push({
                    id: Date.now(),
                    title: title,
                    quadrant: quadrant
                });
            }

            save();
            render();
            bootstrap.Modal.getInstance($('#eisenhowerModal')[0]).hide();
            showToast(editingId ? 'Task diperbarui!' : 'Task ditambahkan!');
            editingId = null;
        });

        // Delete
        $(document).on('click', '.eq-item-delete', function(e) {
            e.stopPropagation();
            const id = $(this).closest('.eq-item').data('id');
            tasks = tasks.filter(t => t.id !== id);
            save();
            render();
        });

        // Drag & Drop between quadrants
        initDragDrop();
    }

    function initDragDrop() {
        $(document).on('dragstart', '.eq-item', function(e) {
            $(this).addClass('dragging');
            e.originalEvent.dataTransfer.effectAllowed = 'move';
            e.originalEvent.dataTransfer.setData('text/plain', $(this).data('id'));
        });

        $(document).on('dragend', '.eq-item', function() {
            $(this).removeClass('dragging');
            $('.eisenhower-quadrant').removeClass('drag-over');
        });

        $(document).on('dragover', '.eq-items, .eisenhower-quadrant', function(e) {
            e.preventDefault();
            $(this).closest('.eisenhower-quadrant').addClass('drag-over');
        });

        $(document).on('dragleave', '.eisenhower-quadrant', function() {
            $(this).removeClass('drag-over');
        });

        $(document).on('drop', '.eq-items, .eisenhower-quadrant', function(e) {
            e.preventDefault();
            $('.eisenhower-quadrant').removeClass('drag-over');
            
            const quadrant = $(this).closest('.eisenhower-quadrant').data('quadrant');
            const taskId = parseInt(e.originalEvent.dataTransfer.getData('text/plain'));
            
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.quadrant = quadrant;
                save();
                render();
            }
        });
    }

    function render() {
        ['do', 'schedule', 'delegate', 'eliminate'].forEach(function(q) {
            const qTasks = tasks.filter(t => t.quadrant === q);
            const containerId = 'eq' + q.charAt(0).toUpperCase() + q.slice(1);
            const $container = $(`#${containerId}`);
            $container.empty();

            qTasks.forEach(function(task) {
                $container.append(`
                    <div class="eq-item" data-id="${task.id}" draggable="true">
                        <span>${$('<span>').text(task.title).html()}</span>
                        <button class="eq-item-delete"><i class="bi bi-x"></i></button>
                    </div>
                `);
            });
        });
    }

    function save() {
        Storage.set(STORAGE_KEY, tasks);
    }

    return { init };
})();

$(document).ready(function() {
    Eisenhower.init();
});
