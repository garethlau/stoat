import React, { useMemo } from 'react';
import { useExperimentManager } from '../contexts/experimentManager';
import { ExperimentProvider } from '../contexts/experiment';
import { Experiment as ExperimentClass } from '../experiment';
import { Result } from '../types';

interface Props {
  children: React.ReactNodeArray;
  name: string;
  refreshOnMount?: boolean;
}

export const Experiment: React.FC<Props> = ({ children, name, refreshOnMount = false }) => {
  const experimentManager = useExperimentManager();
  const experiment = new ExperimentClass(name);

  const variant = useMemo(() => {
    if (refreshOnMount) {
      experimentManager.clearResult(name);
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
    if (experimentManager.hasResult(name, variantNames)) {
      const result: Result = experimentManager.getResult(name);
      return children[result.selected];
    } else {
      const index = indices[Math.floor(Math.random() * indices.length)];
      const result: Result = {
        variants: variantNames,
        selected: index,
      };

      experiment.setResult(result);
      experimentManager.saveResult(name, result);
      return children[result.selected];
    }
  }, [name, children]);

  return <ExperimentProvider experiment={experiment}>{variant}</ExperimentProvider>;
};
