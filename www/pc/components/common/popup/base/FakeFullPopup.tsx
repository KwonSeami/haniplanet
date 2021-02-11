import * as React from 'react';
import Popup, {PopupProps} from './Popup';

interface Props extends PopupProps {
  className?: string;
  children: React.ReactNode;
  callback?: () => void;
}

const FakeFullPopup = React.memo<Props>(props => {
  const {id, className, children, callback} = props;

  return (
    <Popup
      id={id}
      className={className}
      afterClose={callback}
      isOpen
      full
    >
      {children}
    </Popup>
  );
});

export default FakeFullPopup;
