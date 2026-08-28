// backend/src/services/cache.service.ts
/**
 * Simple In-Memory Cache Service dengan TTL (Time To Live)
 */

interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

export class CacheService {
  private cache = new Map<string, CacheItem<unknown>>();

  /**
   * Mengambil item dari cache jika ada dan belum expired
   */
  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  /**
   * Menyimpan item ke cache dengan TTL tertentu (ms)
   */
  public set<T>(key: string, value: T, ttlMs = 300000): void {
    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Menghapus item tertentu dari cache
   */
  public delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Membersihkan seluruh isi cache
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Memeriksa apakah key telah expired atau tidak ada
   */
  public expired(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return true;
    return Date.now() > item.expiresAt;
  }
}

export const cacheService = new CacheService();
