// apps-script/Code.gs
/**
 * Main Web App Entry Point untuk Google Apps Script.
 * Hanya menangani request parsing, autentikasi secret, dan dispatching.
 */

/**
 * Public health check endpoint
 * Tidak membutuhkan secret dan tidak mengakses Spreadsheet.
 */
function doGet(e) {
  var responseData = {
    status: "OK",
    message: "Google Apps Script Data Service Layer Web App is Active",
    timestamp: Utils.now()
  };
  return Response.success(responseData);
}

/**
 * Main HTTP POST Entry Point untuk seluruh komunikasi dari Express Backend.
 */
function doPost(e) {
  try {
    // 1. Parse JSON Body
    if (!e || !e.postData || !e.postData.contents) {
      return Response.badRequest("Request body kosong atau format tidak valid.");
    }

    var body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch (err) {
      return Response.badRequest("Format JSON body tidak valid.");
    }

    var secret = body.secret;
    var traceId = body.traceId || ("TRC-" + Utils.uuid().substring(0, 8));
    var timestamp = body.timestamp || Utils.now();
    var action = body.action;
    var payload = body.payload || {};

    // 2. Authenticate Shared Secret
    if (!authenticate(secret)) {
      // Log perobaan unauthenticated tanpa membocorkan secret
      SpreadsheetService.writeLog({
        trace_id: traceId,
        level: "WARNING",
        service: "Code.gs",
        action: "authenticate",
        message: "Autentikasi gagal: Secret tidak cocok atau tidak dikirim.",
        payload: { action: action }
      });
      return Response.unauthorized("Autentikasi Gagal: Invalid atau Missing Shared Secret.");
    }

    // 3. Dispatch Request ke Router
    if (!action) {
      return Response.badRequest("Field 'action' wajib disertakan dalam request body.");
    }

    return Routes.dispatch(action, payload, traceId, timestamp);

  } catch (err) {
    Logger.log("Error pada Code.gs doPost: " + err.toString());
    return Response.internalError("Internal Apps Script Exception: " + err.toString());
  }
}

/**
 * Memvalidasi Shared Secret dari Request Body terhadap Config.SHARED_SECRET.
 * Menggunakan prinsip Fail-Closed: Jika Config.SHARED_SECRET belum dikonfigurasi atau berupa placeholder,
 * seluruh request akan ditolak (return false).
 * @param {string} secret 
 * @returns {boolean}
 */
function authenticate(secret) {
  if (!secret || typeof secret !== 'string') return false;
  
  var configuredSecret = Config.SHARED_SECRET;
  if (!configuredSecret || configuredSecret === "YOUR_SHARED_SECRET_KEY_PLACEHOLDER") {
    Logger.log("Authentication Error: Config.SHARED_SECRET belum dikonfigurasi.");
    return false;
  }

  return configuredSecret === secret;
}

/**
 * Helper manual yang dapat dijalankan satu kali dari Apps Script Editor
 * untuk menginisialisasi 5 Sheet utama beserta header kolomnya.
 */
function setupSpreadsheet() {
  return SpreadsheetService.setupSpreadsheet();
}
