import { useState } from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';

type IconButtonAlternateProps = IconButtonProps & {
  iconA: React.ReactNode,
  iconB: React.ReactNode,
}

const IconButtonAlternate = (props: IconButtonAlternateProps) => {
  const {iconA, iconB, disabled, onClick, children, ...restProps} = props;
  const [showA, setShowA] = useState(true);

  const onClickDecorated = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }

    setShowA(false);
    setTimeout(() => {
      setShowA(true);
    }, 1500);
  };

  return (
    <IconButton
      disabled={disabled || !showA}
      onClick={onClickDecorated}
      {...restProps}
    >
      {showA && iconA}
      {!showA && iconB}
    </IconButton>
  );
};

export default IconButtonAlternate;
