/**
 * Penyimpanan balasan "Titip Doa TKA" memakai Google Sheets.
 * Tempel seluruh isi file ini di Apps Script, lalu Deploy sebagai Web app.
 */

// Akun khusus untuk melihat balasan. Ganti sesuai keinginan sebelum Deploy.
var ADMIN_USER = 'agittt';
var ADMIN_PASS = 'TKASEMANGAT';

var SHEET_NAME = 'Balasan';
var HEADERS = ['id', 'waktu', 'nama', 'kesan', 'pesan', 'stiker', 'sembunyikan'];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

// Buang karakter kontrol, batasi panjang, dan cegah teks diawali = + - @ dibaca sebagai rumus.
function clean_(v, max) {
  var t = String(v == null ? '' : v)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max);
  if (/^[=+\-@]/.test(t)) t = "'" + t;
  return t;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Menerima balasan baru dari siapa saja (tanpa login).
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = JSON.parse(e.postData.contents);
    var nama = clean_(d.name, 40);
    var kesan = clean_(d.kesan, 400);
    var pesan = clean_(d.pesan, 600);
    var stiker = clean_(d.sticker, 8) || '🌸';
    if (!nama || (!kesan && !pesan)) return json_({ ok: false, error: 'kosong' });
    getSheet_().appendRow([
      Utilities.getUuid().slice(0, 8),
      new Date().getTime(),
      nama, kesan, pesan, stiker, ''
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Mengirim daftar balasan (terbaru dulu), hanya jika username dan password benar.
// Baris yang kolom "sembunyikan"-nya terisi tidak ditampilkan.
function doGet(e) {
  var p = (e && e.parameter) || {};
  var okUser = String(p.u || '').trim().toLowerCase() === String(ADMIN_USER).toLowerCase();
  var okPass = String(p.p || '') === String(ADMIN_PASS);
  if (!okUser || !okPass) return json_({ ok: false, error: 'unauthorized' });

  var sh = getSheet_();
  var last = sh.getLastRow();
  if (last < 2) return json_({ ok: true, replies: [] });
  var rows = sh.getRange(2, 1, last - 1, 7).getValues();
  var out = [];
  for (var i = rows.length - 1; i >= 0 && out.length < 300; i--) {
    var r = rows[i];
    if (String(r[6]).trim() !== '') continue;
    out.push({
      id: String(r[0]),
      createdAt: Number(r[1]),
      name: r[2],
      kesan: r[3],
      pesan: r[4],
      sticker: r[5]
    });
  }
  return json_({ ok: true, replies: out });
}
