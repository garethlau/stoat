import React, { useMemo } from 'react';
import { useLab } from '../contexts/lab';
import { ExperimentProvider } from '../contexts/experiment';
import { Experiment as ExperimentClass } from '../experiment';
import { Result } from '../types';

interface Props {
  children: React.ReactNodeArray;
  name: string;
  refreshOnMount?: boolean;
}

export const Experiment: React.FC<Props> = ({ children, name, refreshOnMount = false }) => {
  const lab = useLab();
  const experiment = new ExperimentClass(name);

  const variant = useMemo(() => {
    if (refreshOnMount) {
      lab.clearResult(name);
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
    if (lab.hasResult(name, variantNames)) {
      const result: Result = lab.getResult(name);
      return children[result.selected];
    } else {
      const index = indices[Math.floor(Math.random() * indices.length)];
      const result: Result = {
        variants: variantNames,
        selected: index,
      };

      experiment.setResult(result);
      lab.saveResult(name, result);
      return children[result.selected];
    }
  }, [name, children]);

  return <ExperimentProvider experiment={experiment}>{variant}</ExperimentProvider>;
};
