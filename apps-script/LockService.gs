// apps-script/LockService.gs
/**
 * Wrapper Abstraksi untuk Google Apps Script LockService.
 * Mencegah race condition saat pembuatan Request ID atau perubahan data bersamaan.
 */

var AppLockService = {
  /**
   * Mengambil Script Lock
   * @private
   */
  _getLock: function() {
    return LockService.getScriptLock();
  },

  /**
   * Membuka kuncian dengan timeout (default 10 detik)
   * @param {number} [timeoutMs=10000]
   * @returns {boolean}
   */
  lock: function(timeoutMs) {
    var timeout = timeoutMs || 10000;
    var scriptLock = this._getLock();
    try {
      scriptLock.waitLock(timeout);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Melepas kuncian Script Lock
   */
  unlock: function() {
    try {
      var scriptLock = this._getLock();
      scriptLock.releaseLock();
    } catch (e) {
      // Ignored
    }
  },

  /**
   * Menjalankan callback di dalam blok terproteksi Lock
   * @param {Function} callback 
   * @param {number} [timeoutMs=10000] 
   * @returns {*} Return value dari callback
   */
  withLock: function(callback, timeoutMs) {
    var acquired = this.lock(timeoutMs);
    if (!acquired) {
      throw new Error("LockTimeoutError: Gagal mendapatkan lock dalam batas waktu yang ditentukan.");
    }
    try {
      return callback();
    } finally {
      this.unlock();
    }
  }
};
