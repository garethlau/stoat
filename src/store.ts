import { Result } from './types';

function sameVariants(arr1: any[], arr2: any[]): boolean {
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) return false;
  const length = arr1.length;
  for (let i = 0; i < length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

export function clearResult(name: string): void {
  localStorage.removeItem(name);
}

export function hasResult(name: string, variants: string[]): boolean {
  const rawData = localStorage.getItem(name);
  if (!rawData) return false;
  const result: Result = JSON.parse(rawData);
  if (!sameVariants(result.variants, variants)) return false;
  return true;
}

export function getResult(name: string): Result {
  const rawData = localStorage.getItem(name);
  if (!rawData) throw new Error('No saved result');
  const result: Result = JSON.parse(rawData);
  return result;
}

export function saveResult(name: string, result: Result) {
  const rawData = JSON.stringify(result);
  localStorage.setItem(name, rawData);
}

const store = {
  saveResult,
  hasResult,
  clearResult,
  getResult,
};

export default store;
