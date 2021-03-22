import { Result } from './types';
import Store from './Store';

export interface LabConfig {
  debug?: boolean;
  logging?: boolean;
  endpoint?: string;
}

export class Lab {
  endpoint?: string;
  debug: boolean = false;
  logging: boolean = true;
  experiments: Record<string, Result> = {};
  store: Store;

  constructor(config?: LabConfig) {
    this.store = new Store();
    this.experiments = this.store.getAllExperiments();

    if (config) {
      this.debug = config.debug || false;
      this.endpoint = config.endpoint || undefined;
      this.logging = config.logging || true;
    }
  }

  hasResult(name: string, variants: string[]): boolean {
    return this.store.hasResult(name, variants);
  }

  getResult(name: string): Result {
    return this.experiments[name];
  }

  clearResult(name: string): void {
    this.store.clearResult(name);
  }

  async saveResult(name: string, result: Result) {
    if (this.logging) {
      const data = { name, variants: result.variants, active: result.variants[result.selected] };
      await this._log(data);
    }

    this.store.saveResult(name, result);

    this.experiments[name] = result;
  }

  async _log(data: any) {
    if (!this.endpoint) return;
    const response = await fetch(this.endpoint, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    if (this.debug) {
      console.log(response);
    }
  }
}
