// apps-script/RequestService.gs
/**
 * Service pengelola data Permohonan Pendampingan.
 */

var RequestService = {
  /**
   * Menghasilkan Request ID baru yang unik dan terurut (REQ-YYYY-000001)
   * Wajib menggunakan LockService dan Sequence Sheet.
   * @returns {string}
   */
  generateRequestId: function() {
    return AppLockService.withLock(function() {
      var currentYear = new Date().getFullYear();
      var seq = SpreadsheetService.nextSequence("REQUEST_ID");
      var paddedSeq = ("000000" + seq).slice(-6);
      return Config.REQUEST_ID_PREFIX + "-" + currentYear + "-" + paddedSeq;
    });
  },

  /**
   * Mengajukan Permohonan Pendampingan Baru
   * @param {Object} payload 
   * @param {string} traceId 
   * @returns {Object} Data permohonan yang berhasil disimpan
   */
  submit: function(payload, traceId) {
    var valid = Utils.validate(payload, ['nama', 'email', 'jenis_layanan_id']);
    if (!valid.valid) {
      throw new Error("Field " + valid.missingField + " wajib diisi.");
    }

    var requestId = this.generateRequestId();
    var now = Utils.now();
    var schemaVersion = payload.schema_version || Config.SCHEMA_VERSION_DEFAULT;
    var detailJson = typeof payload.detail_json === 'object' ? JSON.stringify(payload.detail_json) : (payload.detail_json || '{}');
    var status = Config.STATUS.SUBMITTED;

    var row = [
      requestId,
      now,
      now,
      Utils.sanitize(payload.nama || ''),
      Utils.sanitize(payload.jabatan || ''),
      Utils.sanitize(payload.nip || ''),
      Utils.sanitize(payload.instansi || ''),
      Utils.sanitize(payload.wilayah || ''),
      Utils.sanitize(payload.kontak || ''),
      Utils.sanitize(payload.email || ''),
      payload.jenis_layanan_id,
      schemaVersion,
      detailJson,
      status,
      payload.pic || '',
      payload.catatan || '',
      '', // deleted_at
      ''  // deleted_by
    ];

    SpreadsheetService.append(Config.SHEETS.PERMOHONAN, row);

    SpreadsheetService.writeLog({
      trace_id: traceId,
      request_id: requestId,
      level: "INFO",
      service: "RequestService",
      action: "submitPermohonan",
      message: "Permohonan berhasil diajukan dengan Request ID " + requestId,
      payload: { email: payload.email, jenis_layanan_id: payload.jenis_layanan_id }
    });

    return {
      request_id: requestId,
      status: status,
      created_at: now
    };
  },

  /**
   * Mencari permohonan berdasarkan Request ID
   * @param {Object} payload 
   * @returns {Object|null}
   */
  find: function(payload) {
    if (!payload || !payload.request_id) {
      throw new Error("request_id wajib disertakan dalam payload.");
    }

    var found = SpreadsheetService.findById(Config.SHEETS.PERMOHONAN, payload.request_id);
    if (!found) return null;

    var row = found.rowData;
    // Cek jika sudah di-soft-delete
    if (row[16]) return null;

    return {
      request_id: row[0],
      created_at: row[1],
      updated_at: row[2],
      nama: row[3],
      jabatan: row[4],
      nip: row[5],
      instansi: row[6],
      wilayah: row[7],
      kontak: row[8],
      email: row[9],
      jenis_layanan_id: row[10],
      schema_version: row[11],
      detail_json: Utils.parseJson(row[12]),
      status: row[13],
      pic: row[14],
      catatan: row[15]
    };
  },

  /**
   * Mengambil semua daftar permohonan (yang belum dihapus)
   * @returns {Array<Object>}
   */
  findAll: function() {
    var sheet = SpreadsheetService.getSheet(Config.SHEETS.PERMOHONAN);
    var data = sheet.getDataRange().getValues();
    var result = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[16]) { // Tidak di-soft delete
        result.push({
          request_id: row[0],
          created_at: row[1],
          updated_at: row[2],
          nama: row[3],
          instansi: row[6],
          jenis_layanan_id: row[10],
          status: row[13],
          pic: row[14]
        });
      }
    }
    return result;
  },

  /**
   * Memperbarui status permohonan
   * @param {Object} payload 
   * @param {string} traceId 
   */
  updateStatus: function(payload, traceId) {
    var valid = Utils.validate(payload, ['request_id', 'status']);
    if (!valid.valid) {
      throw new Error("Field " + valid.missingField + " wajib diisi.");
    }

    var now = Utils.now();
    var updates = {
      3: now,                  // updated_at (col 3)
      14: payload.status,      // status (col 14)
      15: payload.pic || "",   // pic (col 15)
      16: payload.catatan || ""// catatan (col 16)
    };

    SpreadsheetService.update(Config.SHEETS.PERMOHONAN, 1, payload.request_id, updates);

    SpreadsheetService.writeLog({
      trace_id: traceId,
      request_id: payload.request_id,
      level: "INFO",
      service: "RequestService",
      action: "updateStatus",
      message: "Status permohonan diubah menjadi " + payload.status,
      payload: { status: payload.status, pic: payload.pic }
    });

    return { request_id: payload.request_id, status: payload.status, updated_at: now };
  },

  /**
   * Soft delete permohonan
   * @param {Object} payload 
   * @param {string} traceId 
   */
  softDelete: function(payload, traceId) {
    if (!payload || !payload.request_id) {
      throw new Error("request_id wajib diisi.");
    }

    SpreadsheetService.softDelete(Config.SHEETS.PERMOHONAN, payload.request_id, payload.deleted_by);

    SpreadsheetService.writeLog({
      trace_id: traceId,
      request_id: payload.request_id,
      level: "AUDIT",
      service: "RequestService",
      action: "softDelete",
      message: "Permohonan di-soft-delete oleh " + (payload.deleted_by || "SYSTEM"),
      payload: { deleted_by: payload.deleted_by }
    });

    return { request_id: payload.request_id, deleted: true };
  }
};
