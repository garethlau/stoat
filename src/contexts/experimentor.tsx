import React, { createContext, useContext } from 'react';
import { Experimenter } from '../experimenter';

const ExperimenterContext = createContext<Experimenter | null>(null);

export const ExperimenterProvider: React.FC<{ children: React.ReactNode; experimenter: Experimenter }> = ({
  children,
  experimenter,
}) => {
  return <ExperimenterContext.Provider value={experimenter}>{children}</ExperimenterContext.Provider>;
};

export const useExperimenter = () => {
  const context = useContext(ExperimenterContext);
  if (context === undefined || context === null) {
    throw new Error('useExperimenter must be used within a Experimenter provider');
  }
  return context;
};
