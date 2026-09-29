import { Service } from '@angular/core';

export enum LocalKeys {
  ACCESS_TOKEN = 'token',
  REFRESH_TOKEN = 'refresh',
  USER = 'user',
}

@Service()
export class LocalManagerService {
  getData<T>(key: string): T | null {
    try {
      const savedData = localStorage.getItem(key);

      if (savedData) {
        return JSON.parse(savedData);
      }

      return null;
    } catch (error) {
      console.log('Error reading localStorage', error);
      return null;
    }
  }

  setData<T>(key: string, data: T): void {
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
    } catch (error) {
      console.log('Error setting data in localStorage');
    }
  }

  removeData(key: string) {
    localStorage.removeItem(key);
  }

  clearStorage(): void {
    localStorage.clear();
  }
}
