// apps-script/Response.gs
/**
 * Helper terpusat untuk menghasilkan JSON Response yang konsisten.
 */

var Response = {
  /**
   * Mengembalikan response sukses
   * @param {*} data Data payload response
   * @param {string} [message="Success"] Pesan opsional
   */
  success: function(data, message) {
    var payload = {
      success: true,
      message: message || "Success",
      data: data || {}
    };
    return this._jsonOutput(payload, 200);
  },

  /**
   * Mengembalikan response error umum
   * @param {string} message Pesan error
   * @param {string} [code="INTERNAL_ERROR"] Kode error
   * @param {number} [statusCode=500] HTTP Status Code
   */
  error: function(message, code, statusCode) {
    var payload = {
      success: false,
      message: message || "An error occurred",
      code: code || "INTERNAL_ERROR"
    };
    return this._jsonOutput(payload, statusCode || 500);
  },

  /**
   * Response 400 Bad Request
   * @param {string} message 
   */
  badRequest: function(message) {
    return this.error(message || "Bad Request", "BAD_REQUEST", 400);
  },

  /**
   * Response 401 Unauthorized
   * @param {string} message 
   */
  unauthorized: function(message) {
    return this.error(message || "Unauthorized: Invalid App Secret", "UNAUTHORIZED", 401);
  },

  /**
   * Response 404 Not Found
   * @param {string} message 
   */
  notFound: function(message) {
    return this.error(message || "Resource Not Found", "NOT_FOUND", 404);
  },

  /**
   * Response 500 Internal Error
   * @param {string} message 
   */
  internalError: function(message) {
    return this.error(message || "Internal Server Error", "INTERNAL_ERROR", 500);
  },

  /**
   * Format output TextOutput dengan MimeType JSON
   * @private
   */
  _jsonOutput: function(payload, statusCode) {
    var output = ContentService.createTextOutput(JSON.stringify(payload));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  }
};
