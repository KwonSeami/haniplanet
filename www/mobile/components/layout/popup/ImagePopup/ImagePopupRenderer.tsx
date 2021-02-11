import * as React from 'react';
import {useRouter} from 'next/router';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {showImagePopupThunks} from './store/thunks';
import {getPopups, getShowPopups} from './store/lib';
import {RootState} from '../../../../src/reducers';

const ImagePopupRenderer = () => {
  const {pathname} = useRouter();

  const dispatch = useDispatch();
  const {access, id: myId} = useSelector(
    ({system: {session}}: RootState) => session,
    shallowEqual,
  );

  React.useEffect(() => {
    const cachedImagePopup = getShowPopups(myId);

    // 캐싱된 데이터가 있는 지 확인
    if (cachedImagePopup) {
      dispatch(showImagePopupThunks(cachedImagePopup, pathname));
    } else {
      getPopups(access, myId)
        .then(popups => dispatch(showImagePopupThunks(popups, pathname)));
    }
  }, [pathname, access, myId]);

  return null;
};

export default ImagePopupRenderer;