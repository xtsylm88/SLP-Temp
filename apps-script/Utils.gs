// apps-script/Utils.gs
/**
 * Utility functions umum untuk sanitasi, validasi, parsing, dan utilitas tanggal.
 */

var Utils = {
  /**
   * Sanitasi string untuk mencegah injection atau karakter aneh
   * @param {string} input 
   * @returns {string}
   */
  sanitize: function(input) {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[\<\>]/g, '');
  },

  /**
   * Validasi objek berdasarkan daftar field wajib
   * @param {Object} obj Objek yang akan divalidasi
   * @param {Array<string>} requiredFields Field wajib
   * @returns {{ valid: boolean, missingField: string|null }}
   */
  validate: function(obj, requiredFields) {
    if (!obj || typeof obj !== 'object') {
      return { valid: false, missingField: 'body' };
    }
    for (var i = 0; i < requiredFields.length; i++) {
      var field = requiredFields[i];
      if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
        return { valid: false, missingField: field };
      }
    }
    return { valid: true, missingField: null };
  },

  /**
   * Parse JSON string dengan aman tanpa melempar exception
   * @param {string} jsonStr 
   * @param {*} [defaultValue={}] 
   * @returns {*}
   */
  parseJson: function(jsonStr, defaultValue) {
    var fallback = defaultValue !== undefined ? defaultValue : {};
    if (!jsonStr) return fallback;
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return fallback;
    }
  },

  /**
   * Format Date ke ISO UTC string (yyyy-MM-ddTHH:mm:ssZ)
   * @param {Date} [date] 
   * @returns {string}
   */
  formatDate: function(date) {
    var d = date || new Date();
    return Utilities.formatDate(d, Config.TIMEZONE, Config.DATE_FORMAT);
  },

  /**
   * Mendapatkan ISO timestamp saat ini
   * @returns {string}
   */
  now: function() {
    return this.formatDate(new Date());
  },

  /**
   * Generate UUID v4 sederhana
   * @returns {string}
   */
  uuid: function() {
    return Utilities.getUuid();
  },

  /**
   * Eksekusi aman callback dengan penanganan try-catch
   * @param {Function} callback 
   * @param {string} errorMessage 
   */
  safeExecute: function(callback, errorMessage) {
    try {
      return callback();
    } catch (err) {
      Logger.log((errorMessage || "Utils.safeExecute error: ") + err.toString());
      throw err;
    }
  }
};
