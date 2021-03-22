import React from 'react';
import { useExperiment } from '../contexts/experiment';

interface Props {
  children: React.ReactNode;
  name: string;
  weight?: number;
}

export const Variant: React.FC<Props> = ({ children, name }) => {
  const experiment = useExperiment();
  return (
    <span experiment-name={experiment.name} variant-name={name}>
      {children}
    </span>
  );
};
