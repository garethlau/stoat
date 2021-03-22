import { Result } from './types';

export class Experiment {
  name: string;
  result: Result;

  constructor(name: string) {
    this.name = name;
  }

  setResult(result: Result) {
    this.result = result;
  }
  getResult(): Result {
    return this.result;
  }
}
