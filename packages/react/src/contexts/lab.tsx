import React, { createContext, useContext } from 'react';
import { Lab } from '../Lab';

const LabContext = createContext<Lab | null>(null);

export const LabProvider: React.FC<{
  children: React.ReactNode;
  lab: Lab;
}> = ({ children, lab }) => {
  return <LabContext.Provider value={lab}>{children}</LabContext.Provider>;
};

export const useLab = () => {
  const context = useContext(LabContext);
  if (context === undefined || context === null) {
    throw new Error('useLab must be used within a LabProvider');
  }
  return context;
};
