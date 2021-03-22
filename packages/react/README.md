# Stoat React

## Overview

Client side library for ab-n testing in React written in TypeScript.

## Installation

```
npm install stoat-react
```

or

```
yarn add stoat-react
```

## Quickstart

```jsx
import { LabProvider, Lab, Experiment, Variant } from 'stoat-react';

const lab = new Lab({
  endpoint: '/experiments',
  debug: true,
});

function App() {
  return (
    <LabProvider lab={lab}>
      <Home />
    </LabProvider>
  );
}

const Home: React.FC<{}> = () => {
  return (
    <Experiment name="hero">
      <Variant name="text-only">
        <h1>Welcome!</h1>
      </Variant>
      <Variant name="image-only">
        <img src="some-image" />
      </Variant>
      <Variant name="image-and-text">
        <img src="some-image" />
        <h1>Welcome!</h1>
      </Variant>
    </Experiment>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
```

## Logging

Providing an endpoint in the `Lab` constructor will automatically send results of experiments to the endpoint. You can disable logging by setting `logging` to `false` in the constructor.

A payload is sent to the endpoint when an experiement mounts and a variant is selected. The payload has a schema:

```json
{
  "name": "hero",
  "variants": ["text-only", "image-only", "image-and-text"],
  "active": "text-only"
}
```

You can choose to save the results how you wish. In the future I hope to build middlewares to save and interpret this data.

## API

### `Lab`

The `Lab` is used to configure and interact with experiments.

Options

- `debug?: boolean`
  - Optional
  - Defaults to `false`
  - Set to true to log outputs to console.
- `logging?: boolean`
  - Optional
  - Defaults to `true`
  - Set to false to disable sending experiment logs to the endpoint.
- `endpoint?: string`
  - Optional
  - Endpoint to send experiment results to. Providing no endpoint will disable logging.

### `<LabProvider />`

Options

- `lab: Lab`
  - **Required**
  - Instance of a `Lab` that manages all the experiments. For different configurations, use seperate `LabProvider` components with different instances.

### `<Experiment />`

Options

- `name: string`
  - **Required**
  - The name of the experiment.
- refreshOnMount: boolean
  - Optional
  - Defaults to `false`.
  - Setting this to `true` will cause the experiment to re-run (and select a new variant) on every component re-render.

### `<Variant />`

Options

- `name: string`
  - **Required**
  - The name of the variant.
- `weight: number`
  - Optional
  - Defaults to `1`
  - The weighting of the variant compared to other variants in the experiment. For instance, an experiment with variant `A` with a weight of 2 and variant `B` with a weight of 1 will select variant `A` 2/3 of the time and variant `B` 1/3 of the time.
