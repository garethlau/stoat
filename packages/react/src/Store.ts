import { Result } from './types';

interface LabDb {
  experiments: Record<string, Result>;
}

const defaultLab = {
  experiments: {},
};

const storageKey = 'crazy-slots-experiments';

function sameVariants(arr1: any[], arr2: any[]): boolean {
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) return false;
  const length = arr1.length;
  for (let i = 0; i < length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}
export default class Store {
  constructor() {
    const item = localStorage.getItem(storageKey);
    if (!item) {
      localStorage.setItem(storageKey, JSON.stringify(defaultLab));
    }
  }

  getAllExperiments(): Record<string, Result> {
    const item = localStorage.getItem(storageKey);
    if (!item) return {};
    const labDb: LabDb = JSON.parse(item);
    return labDb.experiments;
  }

  clearResult(name: string): void {
    const item = localStorage.getItem(storageKey);
    if (!item) return;
    const labDb: LabDb = JSON.parse(item);
    delete labDb.experiments[name];

    localStorage.setItem(storageKey, JSON.stringify(labDb));
  }

  hasResult(name: string, variants: string[]): boolean {
    const item = localStorage.getItem(storageKey);
    if (!item) return false;
    const labDb: LabDb = JSON.parse(item);
    const result = labDb.experiments[name];
    if (!result || !result.variants) return false;
    if (!sameVariants(result.variants, variants)) return false;
    return true;
  }

  getResult(name: string): Result {
    const item = localStorage.getItem(name);
    if (!item) throw new Error('No saved result');
    const labDb: LabDb = JSON.parse(item);
    return labDb.experiments[name];
  }

  saveResult(name: string, result: Result) {
    const item = localStorage.getItem(storageKey);
    if (!item) return;

    const labDb: LabDb = JSON.parse(item);
    labDb.experiments[name] = result;
    localStorage.setItem(storageKey, JSON.stringify(labDb));
  }
}
