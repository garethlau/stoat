import { Result } from './types';

export interface ExperimentManagerConfig {
  debug: boolean;
}
export class ExperimentManager {
  endpoint: string;
  debug: boolean = false;

  constructor(endpoint: string, config?: ExperimentManagerConfig) {
    this.endpoint = endpoint;

    if (config) {
      this.debug = config.debug;
    }
  }

  async record(name: string, result: Result) {
    const data = { name, variants: result.variants, active: result.variants[result.selected] };
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
