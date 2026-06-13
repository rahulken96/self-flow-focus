# WorkFlow — Personal Productivity Dashboard

WorkFlow adalah dashboard produktivitas pribadi satu halaman yang dirancang untuk mendukung suasana kerja yang fokus dan terorganisir. Terinspirasi oleh estetika desain ```Trakteer.id & Saweria.co``` dengan skema warna cerah, sudut membulat (*rounded corners*), bayangan solid (*solid flat shadows*), serta dukungan penuh *light* dan *dark mode*.

## 🚀 Fitur Utama

1. **Dashboard Utama & Statistik Harian**
   - Ringkasan cepat sesi Pomodoro, jumlah task selesai, streak kebiasaan, dan total waktu fokus.
   - Widget mini untuk akses cepat Pomodoro dan Todo List.
   - Quotes inspiratif harian yang diperbarui otomatis.

2. **Pomodoro Timer & Log Sesi**
   - Pengaturan durasi fokus, short break, dan long break yang dinamis.
   - Pilihan *auto-switch* ke break dan efek suara notifikasi (menggunakan Web Audio API).
   - Log riwayat sesi fokus dengan label aktivitas yang disimpan rapi.

3. **Tasks & Planning**
   - **Todo List**: Manajemen task harian dengan label prioritas (Low, Medium, High).
   - **Kanban Board**: Drag-and-drop kartu tugas dalam kolom To Do, In Progress, dan Done.
   - **Eisenhower Matrix**: Pengelompokan tugas berdasarkan skala prioritas 4 kuadran (Do, Schedule, Delegate, Eliminate).

4. **Notes & Wellness**
   - **Sticky Notes**: Catatan tempel cepat dengan 6 variasi warna cerah.
   - **Daily Quotes**: Kumpulan quote motivasi termasuk quote ikonik dari karakter game dan film (seperti Skyrim, Red Dead Redemption 2, Star Wars, MCU, dll).
   - **Habit Tracker**: Pelacak kebiasaan mingguan dengan *streak counter* otomatis.
   - **Ambient Sound**: Mixer efek suara latar belakang (Brownian/White Noise, Rain, Cafe, Forest, dll) yang dibuat secara prosedural melalui Web Audio API.

5. **Workspace Tools**
   - **Kalkulator Biasa & Saintifik**: Kalkulator terintegrasi dengan mode DEG/RAD dan operasi lengkap.
   - **Konverter Kurs Mata Uang**: Konversi kurs real-time menggunakan Exchange Rate API (dengan mekanisme caching dan fallback rates offline).

6. **Penyimpanan Lokal & Backup**
   - 100% menggunakan `localStorage` browser tanpa memerlukan registrasi/auth.
   - Fitur **Export & Import Data** dalam format file `.json` untuk backup atau migrasi antar perangkat.

## 🛠️ Tech Stack

- **Core**: HTML5, Vanilla CSS3 (Custom Variables)
- **Library**: jQuery 3.7.1, Bootstrap 5.3.3
- **Icons**: Bootstrap Icons
- **Fonts**: Fredoka (Heading), Nunito (Body), JetBrains Mono (Digital Display)

## 💻 Cara Menjalankan

Aplikasi ini dapat dijalankan sepenuhnya secara offline tanpa memerlukan server, bundler, atau instalasi `npm`.

1. Clone repository ini.
2. Buka folder `self-flow-focus/`.
3. Klik dua kali pada file `index.html` untuk membukanya langsung di web browser pilihan Anda (Chrome, Edge, Firefox, Safari, dll).
