// apps-script/AuditService.gs
/**
 * Service pengelola pencarian dan retrieval Audit Log.
 */

var AuditService = {
  /**
   * Mengambil daftar Audit Log terpaginasi, terfilter, dan tersortir
   * @param {Object} params Query parameters
   * @returns {Object} Paginated Audit Log object
   */
  findAuditLogList: function(params) {
    var p = params || {};
    var page = parseInt(p.page, 10) || 1;
    var pageSize = parseInt(p.pageSize, 10) || 10;
    var search = p.search ? String(p.search).trim().toLowerCase() : "";
    var level = p.level ? String(p.level).trim().toLowerCase() : "";
    var service = p.service ? String(p.service).trim().toLowerCase() : "";
    var actorEmail = p.actorEmail ? String(p.actorEmail).trim().toLowerCase() : "";
    var startDate = p.startDate ? new Date(p.startDate).getTime() : null;
    var endDate = p.endDate ? new Date(p.endDate).getTime() : null;
    var sortBy = p.sortBy || "timestamp";
    var sortOrder = String(p.sortOrder || "desc").toLowerCase();

    var sheet = SpreadsheetService.getSheet(Config.SHEETS.LOG);
    var data = sheet.getDataRange().getValues();

    var items = [];

    // Row 0 is header: timestamp, trace_id, request_id, level, service, action, message, payload, actor_email
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row || row.length === 0 || !row[0]) continue;

      var tsStr = String(row[0]);
      var traceId = String(row[1] || "");
      var requestId = String(row[2] || "");
      var rowLevel = String(row[3] || "INFO");
      var rowService = String(row[4] || "");
      var action = String(row[5] || "");
      var message = String(row[6] || "");
      var rawPayload = row[7];
      var rowActorEmail = String(row[8] || "");

      var parsedPayload = rawPayload;
      if (typeof rawPayload === 'string' && rawPayload.trim().length > 0) {
        try {
          parsedPayload = JSON.parse(rawPayload);
        } catch (e) {
          parsedPayload = rawPayload;
        }
      }

      // 1. Search Filter (request_id, trace_id, message)
      if (search) {
        var matchSearch =
          requestId.toLowerCase().indexOf(search) !== -1 ||
          traceId.toLowerCase().indexOf(search) !== -1 ||
          message.toLowerCase().indexOf(search) !== -1;
        if (!matchSearch) continue;
      }

      // 2. Level Filter
      if (level) {
        if (rowLevel.toLowerCase() !== level) continue;
      }

      // 3. Service Filter
      if (service) {
        if (rowService.toLowerCase() !== service) continue;
      }

      // 4. Actor Email Filter
      if (actorEmail) {
        if (rowActorEmail.toLowerCase().indexOf(actorEmail) === -1) continue;
      }

      // 5. Date Range Filter
      if (startDate || endDate) {
        var rowTime = new Date(tsStr).getTime();
        if (!isNaN(rowTime)) {
          if (startDate && rowTime < startDate) continue;
          if (endDate && rowTime > endDate) continue;
        }
      }

      items.push({
        timestamp: tsStr,
        trace_id: traceId,
        request_id: requestId,
        level: rowLevel,
        service: rowService,
        action: action,
        message: message,
        payload: parsedPayload,
        actor_email: rowActorEmail
      });
    }

    // Sort items
    items.sort(function(a, b) {
      var valA = a[sortBy] || "";
      var valB = b[sortBy] || "";

      if (sortBy === "timestamp") {
        var tA = new Date(valA).getTime() || 0;
        var tB = new Date(valB).getTime() || 0;
        return sortOrder === "asc" ? tA - tB : tB - tA;
      }

      var sA = String(valA).toLowerCase();
      var sB = String(valB).toLowerCase();
      if (sA < sB) return sortOrder === "asc" ? -1 : 1;
      if (sA > sB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    var total = items.length;
    var totalPages = Math.ceil(total / pageSize) || 1;
    var startIndex = (page - 1) * pageSize;
    var paginatedItems = items.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      page: page,
      pageSize: pageSize,
      total: total,
      totalPages: totalPages
    };
  },

  /**
   * Mengambil seluruh baris audit log berdasarkan trace_id (urutan Timestamp ASC)
   * @param {Object} params Object berisi trace_id
   * @returns {Array} List entry log untuk trace_id tersebut
   */
  findAuditTrace: function(params) {
    var p = params || {};
    var targetTraceId = String(p.trace_id || p.traceId || "").trim().toLowerCase();

    if (!targetTraceId) {
      return [];
    }

    var sheet = SpreadsheetService.getSheet(Config.SHEETS.LOG);
    var data = sheet.getDataRange().getValues();

    var entries = [];

    // Header: timestamp, trace_id, request_id, level, service, action, message, payload, actor_email
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row || row.length === 0 || !row[0]) continue;

      var traceId = String(row[1] || "").trim();
      if (traceId.toLowerCase() === targetTraceId) {
        var rawPayload = row[7];
        var parsedPayload = rawPayload;
        if (typeof rawPayload === 'string' && rawPayload.trim().length > 0) {
          try {
            parsedPayload = JSON.parse(rawPayload);
          } catch (e) {
            parsedPayload = rawPayload;
          }
        }

        entries.push({
          timestamp: String(row[0]),
          trace_id: traceId,
          request_id: String(row[2] || ""),
          level: String(row[3] || "INFO"),
          service: String(row[4] || ""),
          action: String(row[5] || ""),
          message: String(row[6] || ""),
          payload: parsedPayload,
          actor_email: String(row[8] || "")
        });
      }
    }

    // Urutan entry selalu Timestamp ASC (chronological order)
    entries.sort(function(a, b) {
      var tA = new Date(a.timestamp).getTime() || 0;
      var tB = new Date(b.timestamp).getTime() || 0;
      return tA - tB;
    });

    return entries;
  },

  /**
   * Mencatat Audit Event dengan validasi parameter terbatas (bukan passthrough bebas).
   * @param {Object} params Object berisi detail audit event
   * @param {string} traceId Trace ID dari HTTP header
   * @returns {Object} Status pendaftaran log
   */
  recordAuditEvent: function(params, traceId) {
    var p = params || {};

    // Validasi level cuma boleh salah satu dari nilai yang dikenal
    var allowedLevels = ["INFO", "WARN", "WARNING", "ERROR", "DEBUG", "AUDIT"];
    var level = String(p.level || "INFO").toUpperCase();
    if (allowedLevels.indexOf(level) === -1) {
      level = "INFO";
    }

    var service = String(p.service || "EXPRESS_ADMIN").substring(0, 100);
    var action = String(p.action || "UNSPECIFIED_ACTION").substring(0, 100);
    var message = String(p.message || "").substring(0, 1000);
    var actorEmail = String(p.actor_email || p.actorEmail || "");
    var requestId = String(p.request_id || p.requestId || "");

    var logEntry = {
      trace_id: traceId || p.trace_id || p.traceId || "N/A",
      request_id: requestId,
      level: level,
      service: service,
      action: action,
      message: message,
      payload: p.payload || {},
      actor_email: actorEmail
    };

    SpreadsheetService.writeLog(logEntry);
    return { recorded: true, action: action, level: level };
  }
};
