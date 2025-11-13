import React from 'react';
import { ClipLoader } from 'react-spinners';
import styles from '@/assets/global/loader.module.scss';

const Loader = ({ color = 'background', size = 30 }) => {
  const spinnerColor =
    color === 'foreground'
      ? 'var(--color-primary-foreground)'
      : 'var(--color-primary)';

  return (
    <div
      className={`${styles.loader} ${color === 'foreground' ? styles.foreground : ''}`}
      style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <ClipLoader size={size} color={spinnerColor} />
    </div>
  );
};

export default Loader;
