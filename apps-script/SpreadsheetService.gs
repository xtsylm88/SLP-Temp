// apps-script/SpreadsheetService.gs
/**
 * Abstraksi Layanan Spreadsheet.
 * Seluruh akses baca/tulis ke Google Spreadsheet wajib melalui service ini.
 */

var SpreadsheetService = {
  /**
   * Mengambil instance Spreadsheet aktif
   * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet}
   */
  getSpreadsheet: function() {
    try {
      return SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {
      if (Config.SPREADSHEET_ID && Config.SPREADSHEET_ID !== "YOUR_SPREADSHEET_ID_PLACEHOLDER") {
        return SpreadsheetApp.openById(Config.SPREADSHEET_ID);
      }
      throw new Error("Spreadsheet null or inaccessible: " + e.toString());
    }
  },

  /**
   * Mengambil Sheet berdasarkan nama
   * @param {string} sheetName 
   * @returns {GoogleAppsScript.Spreadsheet.Sheet}
   */
  getSheet: function(sheetName) {
    var ss = this.getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error("Sheet '" + sheetName + "' tidak ditemukan.");
    }
    return sheet;
  },

  /**
   * Menambahkan satu baris data ke Sheet
   * @param {string} sheetName 
   * @param {Array} rowData 
   */
  append: function(sheetName, rowData) {
    var sheet = this.getSheet(sheetName);
    sheet.appendRow(rowData);
  },

  /**
   * Mencari baris berdasarkan nilai pada kolom tertentu (1-indexed)
   * @param {string} sheetName 
   * @param {number} columnIndex Index kolom (1 = Kolom A)
   * @param {*} value Nilai yang dicari
   * @returns {{ rowIndex: number, rowData: Array }|null}
   */
  findByColumn: function(sheetName, columnIndex, value) {
    var sheet = this.getSheet(sheetName);
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][columnIndex - 1] == value) {
        return { rowIndex: i + 1, rowData: data[i] };
      }
    }
    return null;
  },

  /**
   * Mencari data berdasarkan ID (asumsi ID ada di kolom 1)
   * @param {string} sheetName 
   * @param {*} idValue 
   * @returns {{ rowIndex: number, rowData: Array }|null}
   */
  findById: function(sheetName, idValue) {
    return this.findByColumn(sheetName, 1, idValue);
  },

  /**
   * Memperbarui kolom tertentu pada baris yang cocok dengan key ID
   * @param {string} sheetName 
   * @param {number} keyColumnIndex Index kolom key (1-indexed)
   * @param {*} keyValue Nilai key ID
   * @param {Object} updatedDataMap Map dari columnIndex (1-indexed) ke value baru
   */
  update: function(sheetName, keyColumnIndex, keyValue, updatedDataMap) {
    var found = this.findByColumn(sheetName, keyColumnIndex, keyValue);
    if (!found) {
      throw new Error("Data dengan key '" + keyValue + "' tidak ditemukan di Sheet " + sheetName);
    }
    var sheet = this.getSheet(sheetName);
    for (var colIdx in updatedDataMap) {
      if (updatedDataMap.hasOwnProperty(colIdx)) {
        sheet.getRange(found.rowIndex, parseInt(colIdx, 10)).setValue(updatedDataMap[colIdx]);
      }
    }
  },

  /**
   * Soft delete baris permohonan (mengisi deleted_at dan deleted_by)
   * @param {string} sheetName 
   * @param {string} idValue 
   * @param {string} deletedBy 
   */
  softDelete: function(sheetName, idValue, deletedBy) {
    var found = this.findById(sheetName, idValue);
    if (!found) {
      throw new Error("Data ID '" + idValue + "' tidak ditemukan untuk dihapus.");
    }
    var sheet = this.getSheet(sheetName);
    var nowStr = Utils.now();
    // Asumsi permohonan memiliki kolom deleted_at di col 17 & deleted_by di col 18
    sheet.getRange(found.rowIndex, 17).setValue(nowStr);
    sheet.getRange(found.rowIndex, 18).setValue(deletedBy || "SYSTEM");
  },

  /**
   * Mengambil urutan berikutnya dari sheet Sequence
   * @param {string} sequenceKey Contoh: 'REQUEST_ID'
   * @returns {number}
   */
  nextSequence: function(sequenceKey) {
    var sheetName = Config.SHEETS.SEQUENCE;
    var found = this.findByColumn(sheetName, 1, sequenceKey);
    var sheet = this.getSheet(sheetName);
    var nextVal = 1;
    if (found) {
      var currentVal = parseInt(found.rowData[1], 10) || 0;
      nextVal = currentVal + 1;
      sheet.getRange(found.rowIndex, 2).setValue(nextVal);
    } else {
      sheet.appendRow([sequenceKey, nextVal]);
    }
    return nextVal;
  },

  /**
   * Menyimpan log audit ke sheet Log
   * @param {Object} logParams 
   */
  writeLog: function(logParams) {
    try {
      var sheetName = Config.SHEETS.LOG;
      var row = [
        Utils.now(),
        logParams.trace_id || "",
        logParams.request_id || "",
        logParams.level || "INFO",
        logParams.service || "APP_SCRIPT",
        logParams.action || "",
        logParams.message || "",
        typeof logParams.payload === 'object' ? JSON.stringify(logParams.payload) : (logParams.payload || "")
      ];
      this.append(sheetName, row);
    } catch (e) {
      Logger.log("Gagal menulis log ke Spreadsheet: " + e.toString());
    }
  },

  /**
   * Inisialisasi manual 5 Sheet utama beserta header kolomnya
   */
  setupSpreadsheet: function() {
    var ss = this.getSpreadsheet();
    var schemas = [
      {
        name: Config.SHEETS.MASTER_JENIS_LAYANAN,
        headers: ['id', 'nama', 'deskripsi', 'schema_version', 'field_schema', 'aktif', 'created_at', 'updated_at']
      },
      {
        name: Config.SHEETS.PERMOHONAN,
        headers: ['request_id', 'created_at', 'updated_at', 'nama', 'jabatan', 'nip', 'instansi', 'wilayah', 'kontak', 'email', 'jenis_layanan_id', 'schema_version', 'detail_json', 'status', 'pic', 'catatan', 'deleted_at', 'deleted_by']
      },
      {
        name: Config.SHEETS.USER_ADMIN,
        headers: ['email', 'nama', 'role', 'aktif', 'created_at', 'updated_at']
      },
      {
        name: Config.SHEETS.SEQUENCE,
        headers: ['key', 'value'],
        initialRows: [['REQUEST_ID', 0]]
      },
      {
        name: Config.SHEETS.LOG,
        headers: ['timestamp', 'trace_id', 'request_id', 'level', 'service', 'action', 'message', 'payload']
      }
    ];

    var createdSheets = [];

    for (var i = 0; i < schemas.length; i++) {
      var item = schemas[i];
      var sheet = ss.getSheetByName(item.name);
      if (!sheet) {
        sheet = ss.insertSheet(item.name);
      }

      // Jika sheet masih kosong, tambahkan header
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(item.headers);
        sheet.getRange(1, 1, 1, item.headers.length).setFontWeight("bold");

        // Jika ada initial rows (misal Sequence)
        if (item.initialRows && item.initialRows.length > 0) {
          for (var j = 0; j < item.initialRows.length; j++) {
            sheet.appendRow(item.initialRows[j]);
          }
        }
      }
      createdSheets.push(item.name);
    }

    Logger.log("Setup Spreadsheet selesai untuk sheet: " + createdSheets.join(", "));
    return {
      success: true,
      message: "Spreadsheet berhasil diinisialisasi.",
      sheets: createdSheets
    };
  }
};
