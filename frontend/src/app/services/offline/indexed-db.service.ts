import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase, StoreNames, StoreValue, StoreKey } from 'idb';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private readonly dbPromise: Promise<IDBPDatabase>;

  constructor() {
    this.dbPromise = openDB('WorkoutBuddyDB', 1, {
      upgrade(db) {
        db.createObjectStore('bodyWeightMeasures', { keyPath: 'id', autoIncrement: true });
        db.createObjectStore('exercises', { keyPath: 'id', autoIncrement: true });
      },
    });
  }

  async getAll<T = any>(storeName: StoreNames<unknown>): Promise<T[]> {
    const db = await this.dbPromise;
    return db.getAll(storeName);
  }

  async get<T = any>(storeName: StoreNames<unknown>, id: StoreKey<unknown, string>): Promise<T | undefined> {
    const db = await this.dbPromise;
    return db.get(storeName, id);
  }

  async add<T = any>(storeName: StoreNames<unknown>, item: StoreValue<unknown, StoreNames<unknown>>): Promise<StoreKey<unknown, string>> {
    const db = await this.dbPromise;
    return db.add(storeName, item);
  }

  async put<T = any>(storeName: StoreNames<unknown>, item: StoreValue<unknown, StoreNames<unknown>>): Promise<StoreKey<unknown, string>> {
    const db = await this.dbPromise;
    return db.put(storeName, item);
  }

  async delete(storeName: StoreNames<unknown>, id: StoreKey<unknown, string>): Promise<void> {
    const db = await this.dbPromise;
    return db.delete(storeName, id);
  }

  async clear(storeName: StoreNames<unknown>): Promise<void> {
    const db = await this.dbPromise;
    return db.clear(storeName);
  }
}
