import React, { createContext, useContext } from 'react';
import { ExperimentManager } from '../ExperimentManager';

const ExperimentManagerContext = createContext<ExperimentManager | null>(null);

export const ExperimentManagerProvider: React.FC<{
  children: React.ReactNode;
  experimentManager: ExperimentManager;
}> = ({ children, experimentManager }) => {
  return <ExperimentManagerContext.Provider value={experimentManager}>{children}</ExperimentManagerContext.Provider>;
};

export const useExperimentManager = () => {
  const context = useContext(ExperimentManagerContext);
  if (context === undefined || context === null) {
    throw new Error('useExperimenter must be used within a Experimenter provider');
  }
  return context;
};
