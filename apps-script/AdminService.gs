// apps-script/AdminService.gs
/**
 * Service pengelola data Administrator & Autentikasi.
 */

var AdminService = {
  /**
   * Mencari baris administrator di sheet User Admin berdasarkan email
   * @param {string} email Email admin yang dicari
   * @returns {Object|null} Detail admin atau null jika tidak ditemukan
   */
  findAdminByEmail: function(email) {
    if (!email) {
      throw new Error("Email wajib diisi untuk pencarian admin.");
    }

    var cleanEmail = String(email).trim().toLowerCase();
    var found = SpreadsheetService.findByColumn(Config.SHEETS.USER_ADMIN, 1, cleanEmail);

    // Fallback jika email di sheet disimpan dengan huruf kapital
    if (!found) {
      var sheet = SpreadsheetService.getSheet(Config.SHEETS.USER_ADMIN);
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        var rowEmail = String(data[i][0] || '').trim().toLowerCase();
        if (rowEmail === cleanEmail) {
          found = { rowIndex: i + 1, rowData: data[i] };
          break;
        }
      }
    }

    if (!found) {
      return null;
    }

    var row = found.rowData;
    var isAktif = (row[3] === true || String(row[3]).toUpperCase() === 'TRUE' || row[3] === 1);

    return {
      email: row[0],
      nama: row[1] || "",
      role: row[2] || "ADMIN",
      aktif: isAktif,
      created_at: row[4] || "",
      updated_at: row[5] || "",
      last_login: row[6] || ""
    };
  },

  /**
   * Memperbarui informasi last_login, last_login_ip, dan last_login_trace_id
   * @param {Object} payload 
   * @param {string} traceId 
   * @returns {Object}
   */
  updateLastLogin: function(payload, traceId) {
    var email = payload ? payload.email : null;
    if (!email) {
      throw new Error("Email wajib diisi untuk memperbarui last login.");
    }

    var cleanEmail = String(email).trim().toLowerCase();
    var now = Utils.now();
    var lastLogin = payload.last_login || now;
    var lastLoginIp = payload.last_login_ip || "";
    var lastLoginTraceId = payload.last_login_trace_id || traceId || "";

    var updates = {
      6: now,                // updated_at (col 6)
      7: lastLogin,          // last_login (col 7)
      8: lastLoginIp,        // last_login_ip (col 8)
      9: lastLoginTraceId    // last_login_trace_id (col 9)
    };

    SpreadsheetService.update(Config.SHEETS.USER_ADMIN, 1, cleanEmail, updates);

    SpreadsheetService.writeLog({
      trace_id: traceId,
      request_id: "",
      level: "INFO",
      service: "AdminService",
      action: "updateLastLogin",
      message: "Last login berhasil diperbarui untuk admin " + cleanEmail,
      payload: { email: cleanEmail, ip: lastLoginIp }
    });

    return {
      email: cleanEmail,
      updated: true
    };
  }
};
