import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {useSelector, useDispatch} from 'react-redux';
import {disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock';
import {RootState} from '../../../src/reducers';
import {popPopup} from '../../../src/reducers/popup';
import {isIOS} from '../../../src/lib/device';

const PopupRenderer = () => {
  const dispatch = useDispatch();
  const popup = useSelector(({popup}: RootState) => popup);
  const appRootElement = React.useRef(null);

  const currentPathname = typeof window !== 'undefined'
    && location.pathname + location.search;

  React.useEffect(() => {
    appRootElement.current = document.getElementById('appRoot');
    return () => {
      clearAllBodyScrollLocks();
    }
  }, []);

  React.useEffect(() => {
    for (const item of popup) {
      if (currentPathname !== item.href) {
        dispatch(popPopup(item.id));
      }
    }

    if (!!popup.length) {
      !isIOS() && disableBodyScroll(appRootElement.current);
    } else {
      enableBodyScroll(appRootElement.current);
    }
  }, [appRootElement.current, currentPathname, popup]);

  return React.useMemo(() => {
    if (!process.browser) {
      return null;
    }

    return (
      popup.map(({id, Popup, props, child}) => ReactDOM.createPortal(
        <Popup
          key={id}
          id={id}
          closePop={(id) => dispatch(popPopup(id))}
          {...props}
        >
          {child}
        </Popup>,
        document.getElementById('popup'),
      ))
    );
  }, [popup, process.browser]);
};

PopupRenderer.displayName = 'PopupRenderer';
export default PopupRenderer;
