// cache.ts
type StorageValue = string | number | boolean | object | null

interface IStorage {
  set(key: string, value: StorageValue): void
  get(key: string): string | null
  setJSON<T>(key: string, jsonValue: T): void
  getJSON<T>(key: string): T | null
  remove(key: string): void
}

const sessionCache: IStorage = {
  set(key, value) {
    if (typeof sessionStorage === 'undefined' || key == null || value == null) return
    sessionStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
  },
  get(key) {
    if (typeof sessionStorage === 'undefined' || key == null) return null
    return sessionStorage.getItem(key)
  },
  setJSON<T>(key, jsonValue: T) {
    if (jsonValue != null) {
      this.set(key, JSON.stringify(jsonValue))
    }
  },
  getJSON<T>(key: string): T | null {
    const value = this.get(key)
    if (value != null) {
      try {
        return JSON.parse(value) as T
      } catch (e) {
        console.error('JSON parse error', e)
        return null
      }
    }
    return null
  },
  remove(key) {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(key)
    }
  }
}

const localCache: IStorage = {
  set(key, value) {
    if (typeof localStorage === 'undefined' || key == null || value == null) return
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
  },
  get(key) {
    if (typeof localStorage === 'undefined' || key == null) return null
    return localStorage.getItem(key)
  },
  setJSON<T>(key, jsonValue: T) {
    if (jsonValue != null) {
      this.set(key, JSON.stringify(jsonValue))
    }
  },
  getJSON<T>(key: string): T | null {
    const value = this.get(key)
    if (value != null) {
      try {
        return JSON.parse(value) as T
      } catch (e) {
        console.error('JSON parse error', e)
        return null
      }
    }
    return null
  },
  remove(key) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key)
    }
  }
}

export default {
  session: sessionCache,
  local: localCache
}
