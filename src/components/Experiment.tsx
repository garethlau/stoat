import React, { useEffect, useState } from 'react';
import { useExperimenter } from '../contexts/experimentor';
import { hasResult, saveResult, getResult, clearResult } from '../utils';
import { Result } from '../types';

interface Props {
  children: React.ReactNodeArray;
  name: string;
  refreshOnMount?: boolean;
}

export const Experiment: React.FC<Props> = ({ children, name, refreshOnMount = false }) => {
  const experimenter = useExperimenter();
  const [active, setActive] = useState(-1);

  useEffect(() => {
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
    if (hasResult(name, variantNames)) {
      const result: Result = getResult(name);
      setActive(result.selected);
    } else {
      const index = indices[Math.floor(Math.random() * indices.length)];
      const result: Result = {
        variants: variantNames,
        selected: index,
      };

      setActive(index);
      saveResult(name, result);

      experimenter.record(name, result);
    }
    if (refreshOnMount) {
      clearResult(name);
    }
  }, []);

  return <span experiment-name={name}>{children[active]}</span>;
};
