import * as React from 'react';
import cn from 'classnames';
import {useRouter} from 'next/router';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import Button from '../../../../inputs/Button';
import ReceivedPointArea from './ReceivedPointArea2';
import PointPopup from '../../../../layout/popup/PointPopup';
import ReceivedPointPopup from '../../../../layout/popup/ReceivedPointPopup';
import {staticUrl} from '../../../../../src/constants/env';
import {pushPopup} from '../../../../../src/reducers/popup';
import {numberWithCommas} from '../../../../../src/lib/numbers';
import {$POINT_BLUE, $WHITE} from '../../../../../styles/variables.types';

interface Props {
  canSendPoint: boolean;
  receivedPoint: number;
  storyPk: HashId;
  isWriter: boolean;
}

const ReceivedPoint = React.memo<Props>(props => {
  const {
    canSendPoint,
    receivedPoint,
    storyPk,
    isWriter
  } = props;

  //Redux
  const dispatch = useDispatch();
  const access = useSelector(
    ({system: {session: {access}}}) => access,
    shallowEqual,
  );

  const router = useRouter();

  const handleClickSendPoint = React.useCallback(e => {
    e.stopPropagation();

    if (!!access) {
      dispatch(pushPopup(PointPopup, {storyPk}));
    } else {
      confirm('글에 대한 액션은 로그인 후 가능합니다. 로그인 페이지로 이동하시겠습니까?')
      && router.push('/login');
    }
  }, [access, storyPk]);

  return (
    <ReceivedPointArea
      className={cn("pointer", {canSendPoint})}
      onClick={() => dispatch(
        pushPopup(ReceivedPointPopup, {
          storyPk,
          isWriter
        })
      )}
    >
      <h3>받은 별</h3>
      <p className="ellipsis">
        <img
          src={staticUrl('/static/images/icon/icon-point.png')}
          alt="받은 별"
        />
        {numberWithCommas(receivedPoint)}
      </p>
      {canSendPoint && (
        <Button
          className="receive-star-btn"
          onClick={handleClickSendPoint}
          border={{radius: '13px'}}
          backgroundColor={$POINT_BLUE}
          size={{width: '60px', height: '25px'}}
          font={{size: '11px', weight: 'bold', color: $WHITE}}
        >
          별보내기
        </Button>
      )}
    </ReceivedPointArea>
  );
});

export default ReceivedPoint;
