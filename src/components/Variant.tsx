import React from 'react';

interface Props {
  children: React.ReactNode;
  name: string;
  weight?: number;
}

export const Variant: React.FC<Props> = ({ children, name }) => {
  return <span variant-name={name}>{children}</span>;
};
