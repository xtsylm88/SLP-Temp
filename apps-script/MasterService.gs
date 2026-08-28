// apps-script/MasterService.gs
/**
 * Service pengelola data Master Jenis Layanan.
 */

var MasterService = {
  /**
   * Mengambil daftar jenis layanan (aktif saja atau seluruhnya jika includeInactive = true)
   * @param {Object} [payload]
   * @returns {Array<Object>}
   */
  getJenisLayanan: function(payload) {
    var includeInactive = payload && (payload.includeInactive === true || payload.includeInactive === 'true');
    var sheet = SpreadsheetService.getSheet(Config.SHEETS.MASTER_JENIS_LAYANAN);
    var data = sheet.getDataRange().getValues();
    var result = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var isAktif = (row[5] === true || row[5] === 1 || row[5] === 'TRUE' || row[5] === 'true');
      if (includeInactive || isAktif) {
        result.push({
          id: row[0],
          nama: row[1],
          deskripsi: row[2],
          schema_version: row[3],
          field_schema: Utils.parseJson(row[4], []),
          aktif: isAktif,
          created_at: row[6],
          updated_at: row[7]
        });
      }
    }
    return result;
  },

  /**
   * Mengambil detail jenis layanan berdasarkan ID
   * @param {string} id 
   * @returns {Object|null}
   */
  getJenisLayananById: function(id) {
    if (!id) throw new Error("ID jenis layanan wajib diisi.");
    var found = SpreadsheetService.findById(Config.SHEETS.MASTER_JENIS_LAYANAN, id);
    if (!found) return null;

    var row = found.rowData;
    return {
      id: row[0],
      nama: row[1],
      deskripsi: row[2],
      schema_version: row[3],
      field_schema: Utils.parseJson(row[4], []),
      aktif: row[5],
      created_at: row[6],
      updated_at: row[7]
    };
  },

  /**
   * Menyimpan jenis layanan baru
   * @param {Object} payload 
   */
  saveJenis: function(payload) {
    var valid = Utils.validate(payload, ['id', 'nama', 'field_schema']);
    if (!valid.valid) {
      throw new Error("Field " + valid.missingField + " wajib diisi.");
    }

    var now = Utils.now();
    var schemaJson = typeof payload.field_schema === 'object' ? JSON.stringify(payload.field_schema) : payload.field_schema;
    var row = [
      payload.id,
      payload.nama,
      payload.deskripsi || "",
      payload.schema_version || Config.SCHEMA_VERSION_DEFAULT,
      schemaJson,
      payload.aktif !== undefined ? payload.aktif : true,
      now,
      now
    ];

    SpreadsheetService.append(Config.SHEETS.MASTER_JENIS_LAYANAN, row);
    return { id: payload.id, nama: payload.nama };
  },

  /**
   * Memperbarui jenis layanan yang ada
   * @param {string} id 
   * @param {Object} payload 
   */
  updateJenis: function(id, payload) {
    var now = Utils.now();
    var updates = {
      8: now // updated_at (col 8)
    };

    if (payload.nama !== undefined) updates[2] = payload.nama;
    if (payload.deskripsi !== undefined) updates[3] = payload.deskripsi;
    if (payload.schema_version !== undefined) updates[4] = payload.schema_version;
    if (payload.field_schema !== undefined) {
      updates[5] = typeof payload.field_schema === 'object' ? JSON.stringify(payload.field_schema) : payload.field_schema;
    }
    if (payload.aktif !== undefined) updates[6] = payload.aktif;

    SpreadsheetService.update(Config.SHEETS.MASTER_JENIS_LAYANAN, 1, id, updates);
    return { id: id, updated: true };
  },

  /**
   * Nonaktifkan jenis layanan (soft deletion)
   * @param {string} id 
   */
  deleteJenis: function(id) {
    return this.updateJenis(id, { aktif: false });
  }
};
