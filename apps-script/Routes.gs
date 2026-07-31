// apps-script/Routes.gs
/**
 * Router & Action Dispatcher.
 * Menerima action dari JSON envelope dan mendistribusikan ke Service terkait.
 */

var Routes = {
  /**
   * Dispatch request berdasarkan nama action
   * @param {string} action Nama aksi yang diminta
   * @param {Object} payload Payload data aksi
   * @param {string} traceId Trace ID dari Express
   * @param {string} timestamp Timestamp ISO dari Express
   * @returns {GoogleAppsScript.Content.TextOutput}
   */
  dispatch: function(action, payload, traceId, timestamp) {
    var p = payload || {};

    switch (action) {
      case "health":
        return Response.success({
          status: "UP",
          service: "Google Apps Script Web App",
          timestamp: Utils.now(),
          traceId: traceId
        }, "Authenticated Health Check Successful");

      case "getJenisLayanan":
        var list = MasterService.getJenisLayanan();
        return Response.success(list);

      case "getJenisLayananById":
        var jenis = MasterService.getJenisLayananById(p.id);
        if (!jenis) {
          return Response.notFound("Jenis Layanan dengan ID " + p.id + " tidak ditemukan.");
        }
        return Response.success(jenis);

      case "submitPermohonan":
        var submitResult = RequestService.submit(p, traceId);
        return Response.success(submitResult, "Permohonan berhasil dikirim.");

      case "findPermohonan":
        var permohonan = RequestService.find(p);
        if (!permohonan) {
          return Response.notFound("Permohonan dengan ID " + p.request_id + " tidak ditemukan.");
        }
        return Response.success(permohonan);

      case "updateStatus":
        var updateResult = RequestService.updateStatus(p, traceId);
        return Response.success(updateResult, "Status permohonan berhasil diperbarui.");

      case "softDelete":
        var deleteResult = RequestService.softDelete(p, traceId);
        return Response.success(deleteResult, "Permohonan berhasil dihapus.");

      default:
        return Response.badRequest("Action '" + action + "' tidak dikenali atau belum didukung.");
    }
  }
};
