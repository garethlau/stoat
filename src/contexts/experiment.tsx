import React, { createContext, useContext } from 'react';
import { Experiment } from '../experiment';

const ExperimentContext = createContext<Experiment | null>(null);

export const ExperimentProvider: React.FC<{ experiment: Experiment; children: React.ReactNode }> = ({
  children,
  experiment,
}) => {
  return <ExperimentContext.Provider value={experiment}>{children}</ExperimentContext.Provider>;
};

export const useExperiment = () => {
  const context = useContext(ExperimentContext);
  if (context === undefined || context === null) {
    throw new Error('useExperiment must be used within ExperimentProvider');
  }
  return context;
};
