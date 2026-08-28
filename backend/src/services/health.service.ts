// backend/src/services/health.service.ts
import { appscriptService } from './appscript.service';
import { cacheService } from './cache.service';
import { envConfig } from '../config/env';
import { HealthStatusResponse } from '../types/appscript';

const HEALTH_CACHE_KEY = 'apps_script_health_status';

export class HealthService {
  /**
   * Mengagregasi status kesehatan seluruh layer (Express, Cache, Apps Script)
   */
  public async getHealthStatus(traceId: string): Promise<HealthStatusResponse> {
    const timestamp = new Date().toISOString();

    // 1. Cek Express status
    const expressStatus: 'UP' | 'DOWN' = 'UP';

    // 2. Cek Cache status
    let cacheStatus: 'UP' | 'DOWN' = 'UP';
    try {
      cacheService.set('health_ping', 'ok', 1000);
      const testVal = cacheService.get<string>('health_ping');
      if (testVal !== 'ok') cacheStatus = 'DOWN';
    } catch {
      cacheStatus = 'DOWN';
    }

    // 3. Cek Apps Script status (dengan TTL cache 30–60 detik)
    let appsScriptStatus: 'UP' | 'DOWN' = 'DOWN';
    let appsScriptCached = false;
    let latencyMs = 0;

    const cachedAppsScriptHealth = cacheService.get<'UP' | 'DOWN'>(HEALTH_CACHE_KEY);

    if (cachedAppsScriptHealth) {
      appsScriptStatus = cachedAppsScriptHealth;
      appsScriptCached = true;
    } else {
      const startTime = Date.now();
      try {
        await appscriptService.health(traceId);
        appsScriptStatus = 'UP';
        latencyMs = Date.now() - startTime;
        // Simpan ke cache selama healthCacheTtlMs (45 detik default)
        cacheService.set(HEALTH_CACHE_KEY, 'UP', envConfig.healthCacheTtlMs);
      } catch {
        appsScriptStatus = 'DOWN';
        cacheService.set(HEALTH_CACHE_KEY, 'DOWN', 15000); // jika DOWN, cache pendek 15s
      }
    }

    return {
      success: true,
      services: {
        express: expressStatus,
        appsScript: appsScriptStatus,
        cache: cacheStatus,
      },
      timestamp,
      details: {
        appsScriptCached,
        appsScriptLatencyMs: latencyMs,
      },
    };
  }
}

export const healthService = new HealthService();
