import React from 'react';
import { SaungDigitalLogo } from './SaungDigitalLogo';

interface SamaDigiLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showText?: boolean;
  className?: string;
}

export const SamaDigiLogo: React.FC<SamaDigiLogoProps> = (props) => {
  return <SaungDigitalLogo {...props} />;
};
