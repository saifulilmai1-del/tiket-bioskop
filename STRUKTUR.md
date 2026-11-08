# Struktur awal Laravel LayarKita

Folder ini adalah kerangka tujuan untuk aplikasi Laravel. `index.html` tetap menjadi prototipe yang bisa dibuka langsung; folder Laravel di bawah ini belum menjadi aplikasi yang dapat dijalankan sampai kerangka Laravel resmi dibuat dengan Composer.

```text
app/
  Http/Controllers/       Pengendali katalog dan pemesanan
  Models/                 Model Film, Jadwal, Kursi, dan Pemesanan
database/
  migrations/             Struktur tabel database
  seeders/                Data contoh film dan jadwal
resources/
  css/app.css             Gaya aplikasi
  js/app.js               Interaksi front-end
  views/
    layouts/              Kerangka halaman bersama
    components/           Komponen Blade yang dipakai ulang
    movies/               Katalog dan rincian film
    bookings/             Form pemesanan dan e-tiket
public/
  images/
    Logo Hapiz@1x.png     Logo Hapiz yang digunakan di header
    posters/              Poster contoh, boleh diganti
routes/
  web.php                 Alamat/route halaman
tests/
  Feature/                Pengujian alur pemesanan
```

Poster SVG di `public/images/posters/` dan logo adalah aset contoh buatan untuk proyek ini. Ganti dengan aset desain Anda sendiri bila diperlukan. Jangan masukkan data pribadi atau rahasia ke repositori.
