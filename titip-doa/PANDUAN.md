# Panduan: Titip Doa TKA di GitHub Pages

Isi folder:
- `index.html` : halaman web (slide doa, form balasan, halaman balasan dengan login)
- `img/` : foto-foto
- `apps-script/Code.gs` : kode penyimpanan balasan di Google Sheets (gratis)

Teman-teman bisa mengirim balasan tanpa akun. Balasan hanya bisa dibaca dengan username dan password yang kamu tentukan (bawaan: `agittt` / `TKASEMANGAT`).

## 1. Buat penyimpanan di Google Sheets (±5 menit)

1. Buka https://sheets.new untuk membuat Google Spreadsheet baru.
2. Klik menu **Ekstensi**, lalu **Apps Script**.
3. Hapus semua kode yang ada, tempel seluruh isi `apps-script/Code.gs`, lalu simpan.
4. (Opsional) Ubah `ADMIN_USER` dan `ADMIN_PASS` di bagian atas kode jika mau username atau password lain.
5. Klik **Deploy**, lalu **New deployment**. Klik ikon roda gigi, pilih **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Klik **Deploy**, lalu **Authorize access** dan pilih akunmu. Jika muncul peringatan "Google hasn't verified this app", klik **Advanced**, lalu **Go to ... (unsafe)**. Ini aman karena skripnya milikmu sendiri.
7. Salin **Web app URL** (berakhiran `/exec`).

## 2. Sambungkan ke halaman

1. Buka `index.html` dengan Notepad atau editor teks apa saja.
2. Cari baris `var API_URL = "";` (sekitar baris 240).
3. Tempel URL tadi di antara tanda kutip:

   `var API_URL = "https://script.google.com/macros/s/xxxxx/exec";`

4. Simpan file.

Jika kamu mengubah username atau password di Apps Script, halaman tetap meminta login dengan nilai bawaan lebih dulu. Untuk menggantinya juga di halaman, kabari Claude agar kode di `index.html` disesuaikan.

## 3. Unggah ke GitHub Pages

1. Buka https://github.com/new, buat repository baru (misalnya `titip-doa`), pilih **Public**.
2. Klik **uploading an existing file**, seret isi folder ini (`index.html` dan folder `img`). Folder `apps-script` boleh ikut atau tidak. Klik **Commit changes**.
3. Buka **Settings**, lalu **Pages**. Pada "Source" pilih **Deploy from a branch**, branch **main**, folder **/ (root)**, lalu **Save**.
4. Tunggu 1 sampai 2 menit. Link-nya: `https://USERNAME.github.io/titip-doa/`
5. Halaman balasan bisa dibuka langsung lewat `https://USERNAME.github.io/titip-doa/#balasan`.

Netlify Drop (https://app.netlify.com/drop) juga bisa: seret folder ini dan kamu langsung mendapat link.

## 4. Mengelola balasan

- Semua balasan tersimpan di sheet **Balasan**, jadi bisa dibaca di Google Sheets juga.
- Untuk menyembunyikan satu balasan dari halaman, isi kolom **sembunyikan** pada barisnya dengan huruf apa saja.
- Setelah mengubah kode Apps Script: **Deploy**, **Manage deployments**, ikon pensil, **New version**, **Deploy**. URL tetap sama.

## Catatan

- Balasan hanya dikirim ke pembaca yang memasukkan username dan password yang benar, dan pengecekannya dilakukan di sisi Apps Script.
- Siapa pun yang tahu URL Web app bisa mengirim balasan baru. Kode sudah membatasi panjang teks dan menyaring karakter aneh.
- Foto di halaman bisa dilihat siapa saja yang punya link-nya.
