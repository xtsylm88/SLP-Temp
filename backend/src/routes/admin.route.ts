// backend/src/routes/admin.route.ts
import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth';
import { appscriptService } from '../services/appscript.service';
import { cacheService } from '../services/cache.service';
import { PermohonanListQuery, FieldSchemaItem, AuditLogListQuery } from '../types/appscript';
import { BadRequestError } from '../utils/errors';
import { toPaginatedPermohonanAdminDTO, toPermohonanAdminDTO } from '../mappers/permohonan.mapper';
import { toJenisLayananListAdminDTO, toJenisLayananAdminDTO } from '../mappers/jenisLayanan.mapper';
import { toPaginatedAuditLogDTO, toAuditLogDTO } from '../mappers/auditLog.mapper';

export const adminRouter = Router();

// Seluruh Admin Route WAJIB melalui Authentication Middleware
adminRouter.use(requireAuth);

/**
 * Audit Log Helper sederhana untuk mencatat aktivitas Admin
 */
function logAudit(action: string, adminEmail: string, requestId?: string, details?: Record<string, unknown>, traceId?: string) {
  const timestamp = new Date().toISOString();
  console.log(`[AUDIT_LOG][${timestamp}][Trace:${traceId || 'N/A'}][Admin:${adminEmail}] Action: ${action}${requestId ? ` | RequestID: ${requestId}` : ''}`, details ? JSON.stringify(details) : '');
  appscriptService
    .recordAuditEvent(
      {
        trace_id: traceId || 'N/A',
        request_id: requestId || '',
        level: 'INFO',
        service: 'EXPRESS_ADMIN',
        action,
        message: `Admin action ${action}`,
        payload: details || {},
        actor_email: adminEmail,
      },
      traceId || 'N/A'
    )
    .catch((err) => console.error('Failed to write audit log to Apps Script:', err));
}

/**
 * GET /admin/permohonan
 * Mengambil daftar permohonan terpaginasi, terfilter, & tersortir untuk Dashboard Admin
 */
adminRouter.get('/permohonan', async (req: Request, res: Response, next: NextFunction) => {
  const traceId = (req as unknown as { traceId?: string }).traceId || 'admin-list-trace';
  const user = req.user!;

  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const jenisLayananId = req.query.jenisLayananId as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const sortBy = (req.query.sortBy as string) || 'created_at';
    const sortOrder = (req.query.sortOrder as string) || 'desc';

    const query: PermohonanListQuery = {
      page,
      pageSize,
      search,
      status,
      jenisLayananId,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    };

    const rawResult = await appscriptService.findPermohonanList(query, traceId);
    const dtoResult = toPaginatedPermohonanAdminDTO(rawResult);

    logAudit('FETCH_PERMOHONAN_LIST', user.email, undefined, { query }, traceId);

    res.json({
      success: true,
      message: 'Berhasil mengambil daftar permohonan.',
      data: dtoResult,
      traceId,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /admin/permohonan/:requestId
 * Mengambil detail lengkap permohonan
 */
adminRouter.get('/permohonan/:requestId', async (req: Request, res: Response, next: NextFunction) => {
  const traceId = (req as unknown as { traceId?: string }).traceId || 'admin-detail-trace';
  const { requestId } = req.params;
  const user = req.user!;

  try {
    if (!requestId) {
      throw new BadRequestError('Request ID wajib diisi.', 'MISSING_REQUEST_ID', traceId);
    }

    const rawDetail = await appscriptService.findPermohonan(requestId, traceId);
    const dtoDetail = toPermohonanAdminDTO(rawDetail as any);

    // Audit Log untuk akses data sensitif
    logAudit('VIEW_PERMOHONAN_DETAIL', user.email, requestId, { request_id: requestId }, traceId);

    res.json({
      success: true,
      message: 'Berhasil mengambil detail permohonan.',
      data: dtoDetail,
      traceId,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /admin/permohonan/:requestId/status
 * Memperbarui status permohonan
 */
adminRouter.patch('/permohonan/:requestId/status', async (req: Request, res: Response, next: NextFunction) => {
  const traceId = (req as unknown as { traceId?: string }).traceId || 'admin-update-status-trace';
  const { requestId } = req.params;
  const { status, pic, catatan } = req.body;
  const user = req.user!;

  try {
    if (!requestId || !status) {
      throw new BadRequestError('Request ID dan status baru wajib diisi.', 'INVALID_STATUS_INPUT', traceId);
    }

    const result = await appscriptService.updateStatus(
      {
        request_id: requestId,
        status,
        pic: pic || user.name,
        catatan,
      },
      traceId
    );

    logAudit('UPDATE_PERMOHONAN_STATUS', user.email, requestId, { newStatus: status, pic, catatan }, traceId);

    res.json({
      success: true,
      message: 'Berhasil memperbarui status permohonan.',
      data: result,
      traceId,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /admin/permohonan/:requestId
 * Soft delete permohonan
 */
adminRouter.delete('/permohonan/:requestId', async (req: Request, res: Response, next: NextFunction) => {
  const traceId = (req as unknown as { traceId?: string }).traceId || 'admin-soft-delete-trace';
  const { requestId } = req.params;
  const user = req.user!;

  try {
    if (!requestId) {
      throw new BadRequestError('Request ID wajib diisi.', 'MISSING_REQUEST_ID', traceId);
    }

    const result = await appscriptService.softDelete(
      {
        request_id: requestId,
        deleted_by: user.email,
      },
      traceId
    );

    logAudit('SOFT_DELETE_PERMOHONAN', user.email, requestId, { deleted_by: user.email }, traceId);

    res.json({
      success: true,
      message: 'Berhasil menghapus permohonan (soft delete).',
      data: result,
      traceId,
    });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// MASTER JENIS LAYANAN ENDPOINTS
// ==========================================

/**
 * GET /admin/jenis-layanan
 * Mengambil seluruh Master Jenis Layanan (termasuk non-aktif) untuk Admin
 */
adminRouter.get('/jenis-layanan', async (req: Request, res: Response, next: NextFunction) => {
  const traceId = (req as unknown as { traceId?: string }).traceId || 'admin-jenis-list-trace';
  const user = req.user!;

  try {
    const list = await appscriptService.getJenisLayananAdmin(traceId);
    const dtoList = toJenisLayananListAdminDTO(list);

    logAudit('FETCH_JENIS_LAYANAN_ADMIN', user.email, undefined, undefined, traceId);

    res.json({
      success: true,
      message: 'Berhasil mengambil daftar jenis layanan.',
      data: dtoList,
      traceId,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /admin/jenis-layanan
 * Menambah Master Jenis Layanan Baru
 */
adminRouter.post('/jenis-layanan', async (req: Request, res: Response, next: NextFunction) => {
  const traceId = (req as unknown as { traceId?: string }).traceId || 'admin-jenis-create-trace';
  const user = req.user!;

  try {
    const { id, nama, deskripsi, schema_version, field_schema, aktif } = req.body;

    // 1. Mandatory Validations
    if (!id || typeof id !== 'string' || !id.trim()) {
      throw new BadRequestError('ID Jenis Layanan wajib diisi.', 'INVALID_ID', traceId);
    }
    if (!nama || typeof nama !== 'string' || !nama.trim()) {
      throw new BadRequestError('Nama Jenis Layanan wajib diisi.', 'INVALID_NAME', traceId);
    }

    const targetId = id.trim();
    const cleanNama = nama.trim();

    let parsedSchema: FieldSchemaItem[];
    if (typeof field_schema === 'string') {
      try {
        parsedSchema = JSON.parse(field_schema);
      } catch (e) {
        throw new BadRequestError('Format Field Schema JSON tidak valid.', 'INVALID_JSON_SCHEMA', traceId);
      }
    } else if (Array.isArray(field_schema)) {
      parsedSchema = field_schema;
    } else {
      throw new BadRequestError('Field Schema wajib berupa array item schema valid.', 'INVALID_FIELD_SCHEMA', traceId);
    }

    const parsedVersion = Number(schema_version) || 1;

    // 2. Express Duplication Checks against Apps Script list
    const existingList = await appscriptService.getJenisLayananAdmin(traceId);

    // Check duplicate ID (case-insensitive for internal duplicate check)
    const duplicateId = existingList.find((item) => String(item.id).trim().toLowerCase() === targetId.toLowerCase());
    if (duplicateId) {
      throw new BadRequestError(`ID Jenis Layanan '${id}' sudah digunakan.`, 'DUPLICATE_ID', traceId);
    }

    // Check duplicate active Name
    const duplicateName = existingList.find(
      (item) => item.aktif && String(item.nama).trim().toLowerCase() === cleanNama.toLowerCase()
    );
    if (duplicateName) {
      throw new BadRequestError(`Nama Jenis Layanan '${nama}' sudah digunakan oleh jenis layanan aktif lain.`, 'DUPLICATE_NAME', traceId);
    }

    // 3. Save to Apps Script
    const payload = {
      id: targetId,
      nama: cleanNama,
      deskripsi: deskripsi || '',
      schema_version: parsedVersion,
      field_schema: parsedSchema,
      aktif: aktif !== undefined ? Boolean(aktif) : true,
    };

    const result = await appscriptService.saveJenis(payload, traceId);

    // Clear public cache
    cacheService.delete('jenis-layanan');

    logAudit('CREATE_JENIS_LAYANAN', user.email, undefined, { id: targetId, nama: cleanNama }, traceId);

    res.json({
      success: true,
      message: 'Master jenis layanan berhasil ditambahkan.',
      data: result,
      traceId,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /admin/jenis-layanan/:id
 * Memperbarui Master Jenis Layanan (ID bersifat read-only / primary key)
 */
adminRouter.put('/jenis-layanan/:id', async (req: Request, res: Response, next: NextFunction) => {
  const traceId = (req as unknown as { traceId?: string }).traceId || 'admin-jenis-update-trace';
  const { id } = req.params;
  const user = req.user!;

  try {
    if (!id) {
      throw new BadRequestError('ID Jenis Layanan wajib diisi pada URL.', 'MISSING_ID', traceId);
    }

    const { nama, deskripsi, schema_version, field_schema, aktif } = req.body;

    if (!nama || typeof nama !== 'string' || !nama.trim()) {
      throw new BadRequestError('Nama Jenis Layanan wajib diisi.', 'INVALID_NAME', traceId);
    }

    const targetId = id.trim();
    const cleanNama = nama.trim();

    let parsedSchema: FieldSchemaItem[] | undefined;
    if (field_schema !== undefined) {
      if (typeof field_schema === 'string') {
        try {
          parsedSchema = JSON.parse(field_schema);
        } catch (e) {
          throw new BadRequestError('Format Field Schema JSON tidak valid.', 'INVALID_JSON_SCHEMA', traceId);
        }
      } else if (Array.isArray(field_schema)) {
        parsedSchema = field_schema;
      } else {
        throw new BadRequestError('Field Schema wajib berupa array item schema valid.', 'INVALID_FIELD_SCHEMA', traceId);
      }
    }

    // Check duplicate active Name (excluding current ID, comparing case-insensitively for check only)
    const existingList = await appscriptService.getJenisLayananAdmin(traceId);
    const duplicateName = existingList.find(
      (item) =>
        String(item.id).trim().toLowerCase() !== targetId.toLowerCase() &&
        item.aktif &&
        String(item.nama).trim().toLowerCase() === cleanNama.toLowerCase()
    );

    if (duplicateName) {
      throw new BadRequestError(`Nama Jenis Layanan '${nama}' sudah digunakan oleh jenis layanan aktif lain.`, 'DUPLICATE_NAME', traceId);
    }

    const payload: Record<string, unknown> = {
      nama: cleanNama,
    };
    if (deskripsi !== undefined) payload.deskripsi = deskripsi;
    if (schema_version !== undefined) payload.schema_version = Number(schema_version) || 1;
    if (parsedSchema !== undefined) payload.field_schema = parsedSchema;
    if (aktif !== undefined) payload.aktif = Boolean(aktif);

    const result = await appscriptService.updateJenis(targetId, payload, traceId);

    // Clear public cache
    cacheService.delete('jenis-layanan');

    logAudit('UPDATE_JENIS_LAYANAN', user.email, undefined, { id: targetId, nama: cleanNama }, traceId);

    res.json({
      success: true,
      message: 'Master jenis layanan berhasil diperbarui.',
      data: result,
      traceId,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /admin/jenis-layanan/:id
 * Nonaktifkan Master Jenis Layanan (soft delete, aktif = false)
 */
adminRouter.delete('/jenis-layanan/:id', async (req: Request, res: Response, next: NextFunction) => {
  const traceId = (req as unknown as { traceId?: string }).traceId || 'admin-jenis-delete-trace';
  const { id } = req.params;
  const user = req.user!;

  try {
    if (!id) {
      throw new BadRequestError('ID Jenis Layanan wajib diisi.', 'MISSING_ID', traceId);
    }

    const targetId = id.trim();
    const result = await appscriptService.deleteJenis(targetId, traceId);

    // Clear public cache
    cacheService.delete('jenis-layanan');

    logAudit('DISABLE_JENIS_LAYANAN', user.email, undefined, { id: targetId }, traceId);

    res.json({
      success: true,
      message: 'Master jenis layanan berhasil dinonaktifkan.',
      data: result,
      traceId,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /admin/audit-log
 * Mengambil daftar Audit Log terpaginasi, terfilter, & tersortir
 */
adminRouter.get('/audit-log', async (req: Request, res: Response, next: NextFunction) => {
  const traceId = (req as unknown as { traceId?: string }).traceId || 'admin-audit-list-trace';
  const user = req.user!;

  try {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;
    const search = req.query.search as string;
    const level = req.query.level as string;
    const service = req.query.service as string;
    const actorEmail = req.query.actorEmail as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const sortBy = (req.query.sortBy as string) || 'timestamp';
    const sortOrder = (req.query.sortOrder as string) || 'desc';

    const query: AuditLogListQuery = {
      page,
      pageSize,
      search,
      level,
      service,
      actorEmail,
      startDate,
      endDate,
      sortBy,
      sortOrder,
    };

    const rawResult = await appscriptService.findAuditLogList(query, traceId);
    const dtoResult = toPaginatedAuditLogDTO(rawResult);

    logAudit('READ_AUDIT_LOG_LIST', user.email, undefined, { query }, traceId);

    res.json({
      success: true,
      message: 'Berhasil mengambil daftar audit log.',
      data: dtoResult,
      traceId,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /admin/audit-log/:traceId
 * Mengambil seluruh kronologi / timeline aktivitas untuk satu trace_id
 */
adminRouter.get('/audit-log/:traceId', async (req: Request, res: Response, next: NextFunction) => {
  const traceId = (req as unknown as { traceId?: string }).traceId || 'admin-audit-trace-trace';
  const targetTraceId = req.params.traceId;
  const user = req.user!;

  try {
    if (!targetTraceId) {
      throw new BadRequestError('Trace ID wajib diisi.', 'MISSING_TRACE_ID', traceId);
    }

    const rawEntries = await appscriptService.findAuditTrace(targetTraceId, traceId);
    const dtoEntries = (rawEntries || []).map(toAuditLogDTO);

    logAudit('READ_AUDIT_TRACE', user.email, undefined, { trace_id: targetTraceId }, traceId);

    res.json({
      success: true,
      traceId: targetTraceId,
      entries: dtoEntries,
    });
  } catch (err) {
    next(err);
  }
});
