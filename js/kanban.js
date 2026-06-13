/**
 * Kanban — Drag-and-drop kanban board
 */
const Kanban = (function() {
    'use strict';

    const STORAGE_KEY = 'kanbanCards';
    let cards = [];
    let editingId = null;
    let selectedColor = '#E50027';
    let draggedCard = null;

    function init() {
        cards = Storage.get(STORAGE_KEY, []);
        render();

        // Add card button
        $('#addKanbanCard').on('click', function() {
            editingId = null;
            selectedColor = '#E50027';
            $('#kanbanModalTitle').text('Tambah Card');
            $('#kanbanCardTitle').val('');
            $('#kanbanCardDesc').val('');
            $('#kanbanCardColumn').val('todo');
            $('#kanbanCardId').val('');
            resetColorPicker();
            new bootstrap.Modal('#kanbanModal').show();
        });

        // Save card
        $('#saveKanbanCard').on('click', saveCard);

        // Color picker
        $(document).on('click', '#kanbanColorPicker .color-dot', function() {
            $('#kanbanColorPicker .color-dot').removeClass('active');
            $(this).addClass('active');
            selectedColor = $(this).data('color');
        });

        // Edit card
        $(document).on('click', '.kanban-card-btn.edit', function(e) {
            e.stopPropagation();
            const id = $(this).closest('.kanban-card').data('id');
            editCard(id);
        });

        // Delete card
        $(document).on('click', '.kanban-card-btn.delete', function(e) {
            e.stopPropagation();
            const id = $(this).closest('.kanban-card').data('id');
            if (confirm('Hapus card ini?')) {
                cards = cards.filter(c => c.id !== id);
                save();
                render();
                showToast('Card dihapus.');
            }
        });

        // Drag & Drop
        initDragDrop();
    }

    function initDragDrop() {
        $(document).on('dragstart', '.kanban-card', function(e) {
            draggedCard = $(this).data('id');
            $(this).addClass('dragging');
            e.originalEvent.dataTransfer.effectAllowed = 'move';
            e.originalEvent.dataTransfer.setData('text/plain', draggedCard);
        });

        $(document).on('dragend', '.kanban-card', function() {
            $(this).removeClass('dragging');
            $('.kanban-column').removeClass('drag-over');
            draggedCard = null;
        });

        $(document).on('dragover', '.kanban-cards, .kanban-column', function(e) {
            e.preventDefault();
            e.originalEvent.dataTransfer.dropEffect = 'move';
            $(this).closest('.kanban-column').addClass('drag-over');
        });

        $(document).on('dragleave', '.kanban-column', function() {
            $(this).removeClass('drag-over');
        });

        $(document).on('drop', '.kanban-cards, .kanban-column', function(e) {
            e.preventDefault();
            $('.kanban-column').removeClass('drag-over');

            const column = $(this).closest('.kanban-column').data('column');
            const cardId = parseInt(e.originalEvent.dataTransfer.getData('text/plain'));
            
            const card = cards.find(c => c.id === cardId);
            if (card && card.column !== column) {
                card.column = column;
                save();
                render();
            }
        });
    }

    function saveCard() {
        const title = $('#kanbanCardTitle').val().trim();
        if (!title) return;

        const desc = $('#kanbanCardDesc').val().trim();
        const column = $('#kanbanCardColumn').val();

        if (editingId) {
            const card = cards.find(c => c.id === editingId);
            if (card) {
                card.title = title;
                card.desc = desc;
                card.column = column;
                card.color = selectedColor;
            }
        } else {
            cards.push({
                id: Date.now(),
                title: title,
                desc: desc,
                column: column,
                color: selectedColor,
                createdAt: new Date().toISOString()
            });
        }

        save();
        render();
        bootstrap.Modal.getInstance($('#kanbanModal')[0]).hide();
        showToast(editingId ? 'Card diperbarui!' : 'Card ditambahkan!');
        editingId = null;
    }

    function editCard(id) {
        const card = cards.find(c => c.id === id);
        if (!card) return;

        editingId = id;
        selectedColor = card.color || '#E50027';
        $('#kanbanModalTitle').text('Edit Card');
        $('#kanbanCardTitle').val(card.title);
        $('#kanbanCardDesc').val(card.desc);
        $('#kanbanCardColumn').val(card.column);
        
        resetColorPicker();
        $(`#kanbanColorPicker .color-dot[data-color="${card.color}"]`).addClass('active');

        new bootstrap.Modal('#kanbanModal').show();
    }

    function resetColorPicker() {
        $('#kanbanColorPicker .color-dot').removeClass('active');
        $('#kanbanColorPicker .color-dot').first().addClass('active');
        selectedColor = '#E50027';
    }

    function render() {
        ['todo', 'progress', 'done'].forEach(function(col) {
            const colCards = cards.filter(c => c.column === col);
            const $container = $(`#kanban${col.charAt(0).toUpperCase() + col.slice(1)}`);
            $container.empty();

            colCards.forEach(function(card) {
                $container.append(`
                    <div class="kanban-card" data-id="${card.id}" draggable="true" style="border-left-color: ${card.color}">
                        <div class="kanban-card-title">${$('<span>').text(card.title).html()}</div>
                        ${card.desc ? `<div class="kanban-card-desc">${$('<span>').text(card.desc).html()}</div>` : ''}
                        <div class="kanban-card-actions">
                            <button class="kanban-card-btn edit"><i class="bi bi-pencil"></i></button>
                            <button class="kanban-card-btn delete"><i class="bi bi-trash3"></i></button>
                        </div>
                    </div>
                `);
            });

            const countId = col === 'progress' ? 'Progress' : col.charAt(0).toUpperCase() + col.slice(1);
            $(`#kanbanCount${countId}`).text(colCards.length);
        });
    }

    function save() {
        Storage.set(STORAGE_KEY, cards);
    }

    return { init };
})();

$(document).ready(function() {
    Kanban.init();
});
