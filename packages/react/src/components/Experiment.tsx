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
    const indices: number[] = []; // Array to hold the indices of children based on each weight
    const variantNames: string[] = [];
    let result: Result;

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

    if (lab.hasResult(name, variantNames) && !refreshOnMount) {
      // Use previous result
      result = lab.getResult(name);
    } else {
      // Calculate new index
      const index = indices[Math.floor(Math.random() * indices.length)];
      result = {
        variants: variantNames,
        selected: index,
      };
    }
    if (refreshOnMount) {
      // Clear previously calculated result (there might not be one)
      lab.clearResult(name);
    } else {
      // Save the result to be used in the future
      lab.saveResult(name, result);
    }

    experiment.setResult(result);
    return children[result.selected];
  }, [name, children]);

  return <ExperimentProvider experiment={experiment}>{variant}</ExperimentProvider>;
};
