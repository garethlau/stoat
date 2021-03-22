import React, { useMemo } from 'react';
import { useExperimenter } from '../contexts/experimentor';
import store from '../store';
import { ExperimentProvider } from '../contexts/experiment';
import { Experiment as ExperimentClass } from '../experiment';
import { Result } from '../types';

interface Props {
  children: React.ReactNodeArray;
  name: string;
  refreshOnMount?: boolean;
}

export const Experiment: React.FC<Props> = ({ children, name, refreshOnMount = false }) => {
  const experimenter = useExperimenter();
  const experiment = new ExperimentClass(name);

  const variant = useMemo(() => {
    if (refreshOnMount) {
      store.clearResult(name);
    }
    const indices: number[] = [];
    const variantNames: string[] = [];
    React.Children.forEach(children, (element, index) => {
      if (!React.isValidElement(element)) {
        throw new Error('Invalid variant');
      }

      variantNames.push(element.props.name);
      const { weight = 1 } = element.props;
      for (let i = 0; i < weight; i++) {
        indices.push(index);
      }
    });
    if (store.hasResult(name, variantNames)) {
      const result: Result = store.getResult(name);
      return children[result.selected];
    } else {
      const index = indices[Math.floor(Math.random() * indices.length)];
      const result: Result = {
        variants: variantNames,
        selected: index,
      };

      store.saveResult(name, result);
      console.log(name, result);
      experiment.setResult(result);
      console.log(experiment);
      experimenter.record(name, result);
      return children[result.selected];
    }
  }, [name, children]);

  return <ExperimentProvider experiment={experiment}>{variant}</ExperimentProvider>;
};
