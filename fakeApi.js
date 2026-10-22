import { API_CONFIG } from './settings.js';
import { generateInitialStartups } from './initial-data-sample.js';

// Инициализация данных в localStorage, если их там нет
function initializeStorage() {
  const existing = localStorage.getItem(API_CONFIG.STORAGE_KEY);
  if (!existing) {
    const initialData = generateInitialStartups();
    localStorage.setItem(API_CONFIG.STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  try {
    return JSON.parse(existing);
  } catch (e) {
    const initialData = generateInitialStartups();
    localStorage.setItem(API_CONFIG.STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
}

export const fakeApi = {
  // Получение списка с симуляцией задержки сетевого запроса
  async getItems() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < API_CONFIG.ERROR_CHANCE) {
          reject(new Error("Network Error: Failed to fetch data from server. Please retry."));
          return;
        }
        const data = initializeStorage();
        resolve([...data]);
      }, API_CONFIG.DELAY_MS);
    });
  },

  // Добавление нового элемента в localStorage
  async addItem(newItem) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < API_CONFIG.ERROR_CHANCE) {
          reject(new Error("Server Error: Unable to save new startup. Try again."));
          return;
        }
        const currentData = initializeStorage();
        const created = {
          ...newItem,
          id: `str-${Date.now()}`,
          mrr: Number(newItem.mrr),
          rating: Number(newItem.rating),
          foundedYear: Number(newItem.foundedYear),
          createdAt: new Date().toISOString()
        };
        const updatedData = [created, ...currentData];
        localStorage.setItem(API_CONFIG.STORAGE_KEY, JSON.stringify(updatedData));
        resolve(created);
      }, API_CONFIG.DELAY_MS);
    });
  },

  // Сброс к исходным 105 элементам
  async resetData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const freshData = generateInitialStartups();
        localStorage.setItem(API_CONFIG.STORAGE_KEY, JSON.stringify(freshData));
        resolve(freshData);
      }, API_CONFIG.DELAY_MS);
    });
  }
};
