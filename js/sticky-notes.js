/**
 * Sticky Notes — Color-coded note cards
 */
const StickyNotes = (function() {
    'use strict';

    const STORAGE_KEY = 'stickyNotes';
    const COLORS = ['sticky-yellow', 'sticky-pink', 'sticky-blue', 'sticky-green', 'sticky-purple', 'sticky-orange'];
    let notes = [];

    function init() {
        notes = Storage.get(STORAGE_KEY, []);
        render();

        // Add note
        $('#addStickyNote').on('click', function() {
            const colorIdx = notes.length % COLORS.length;
            notes.push({
                id: Date.now(),
                content: '',
                color: COLORS[colorIdx],
                createdAt: new Date().toISOString()
            });
            save();
            render();
            // Focus the new note
            setTimeout(() => {
                $(`[data-note-id="${notes[notes.length-1].id}"] .sticky-note-content`).focus();
            }, 100);
        });

        // Auto-save on blur
        $(document).on('blur', '.sticky-note-content', function() {
            const id = $(this).closest('.sticky-note').data('note-id');
            const note = notes.find(n => n.id === id);
            if (note) {
                note.content = $(this).val();
                save();
            }
        });

        // Delete note
        $(document).on('click', '.sticky-note-delete', function() {
            const id = $(this).closest('.sticky-note').data('note-id');
            notes = notes.filter(n => n.id !== id);
            save();
            render();
        });

        // Change color on double click
        $(document).on('dblclick', '.sticky-note', function(e) {
            if ($(e.target).is('textarea, button, i')) return;
            const id = $(this).data('note-id');
            const note = notes.find(n => n.id === id);
            if (note) {
                const currentIdx = COLORS.indexOf(note.color);
                note.color = COLORS[(currentIdx + 1) % COLORS.length];
                save();
                render();
            }
        });
    }

    function render() {
        const $grid = $('#stickyGrid');
        $grid.empty();

        if (notes.length === 0) {
            $grid.html(`
                <div class="sticky-empty">
                    <i class="bi bi-sticky"></i>
                    <p>Belum ada catatan. Klik tombol + untuk menambahkan.</p>
                    <p class="text-muted-custom" style="font-size:12px;">Tip: Double-click note untuk ganti warna!</p>
                </div>
            `);
            return;
        }

        notes.forEach(function(note) {
            const date = new Date(note.createdAt);
            const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

            $grid.append(`
                <div class="sticky-note ${note.color}" data-note-id="${note.id}">
                    <textarea class="sticky-note-content" placeholder="Tulis catatan...">${escapeHtml(note.content)}</textarea>
                    <div class="sticky-note-footer">
                        <span class="sticky-note-date">${dateStr}</span>
                        <button class="sticky-note-delete"><i class="bi bi-trash3"></i></button>
                    </div>
                </div>
            `);
        });
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function save() {
        Storage.set(STORAGE_KEY, notes);
    }

    return { init };
})();

$(document).ready(function() {
    StickyNotes.init();
});
