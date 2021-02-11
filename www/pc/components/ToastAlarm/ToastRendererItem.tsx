import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import {toastReducerActions} from '@hanii/toast-renderer';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import StyledToastRendererLi from '../../styles/StyledToastRendererLi';
import {RootState} from '../../src/reducers';
import {staticUrl} from '../../src/constants/env';

const {delToastAlarm} = toastReducerActions;

const CURLY_BRACE_STR_REGEX = new RegExp(/{\w+}/g);
const MAX_ALARM_IDX = 4;
const MAX_PAYLOAD_TEXT_LENGTH = 20;

const ALARM_HREF = {
  point: {
    pathname: '/user/point',
    query: {tab: 'history'},
  },
  point_withdrawal: {
    pathname: '/user/point',
    query: {tab: 'history', list: 'point_withdrawal'},
  }
};

const ToastRendererItem = ({alarmId, message, payload}) => {
  const {user} = payload;
  const [children, setChildren] = React.useState([]);

  const dispatch = useDispatch();
  const recentToastAlarmId = useSelector(({toast: {alarm: toastAlarm = []}}: RootState) => {
    const currToastIdx = toastAlarm?.length - 1;
    const idx = currToastIdx > MAX_ALARM_IDX ? MAX_ALARM_IDX : currToastIdx;

    return toastAlarm[idx]?.alarmId;
  }, shallowEqual);

  const {pathname, hash} = React.useMemo(() => {
    const {primary: _primary, [_primary]: primary} = payload;
    const {search: primarySearch, model: primaryModel, id: primaryId} = primary;
    // search 내에 존재하는 string 값을 추출
    const primarySearchStr = primarySearch?.match(/[a-zA-Z]/g)?.join('');

    // parent_id 또는 id 형태로 값을 저장함. id가 비어 있을 경우, primarySearchStr을 사용
    const {id: searchId, parent_id: searchParentId} = payload[primarySearchStr] || {} as any;
    const hashId = searchParentId ? `${searchParentId}-${searchId}` : searchId;

    return {
      pathname: ALARM_HREF[_primary] || `/${primaryModel.toLowerCase()}/${primaryId}`,
      hash: primarySearch?.replace(CURLY_BRACE_STR_REGEX, hashId ? hashId : primarySearchStr),
    };
  }, [payload]);

  React.useEffect(() => {
    const segments = message.split(CURLY_BRACE_STR_REGEX);
    const patterns = message.match(CURLY_BRACE_STR_REGEX);

    // payload가 stack 형태여서 기존 payload 데이터에 영향을 받지 않도록 비움
    setChildren([]);
    segments.forEach((seg, idx) => {
      seg && setChildren(curr => [...curr, <span key={seg + alarmId}>{seg}</span>]);

      if (idx < segments.length - 1) {
        const patternKey = patterns[idx].replace(/[^(a-zA-Z)]/gi, '');
        const {text: payloadText} = payload[patternKey];

        setChildren(curr => [
          ...curr,
          <strong key={payloadText + alarmId}>
            {payloadText.length <= MAX_PAYLOAD_TEXT_LENGTH
              ? payloadText
              : `${payloadText.substr(0, MAX_PAYLOAD_TEXT_LENGTH)}...`}
          </strong>
        ]);
      }
    });
  }, [message, alarmId, payload]);

  return (
    <StyledToastRendererLi>
      <div className={cn({'on': recentToastAlarmId === alarmId})}>
        <Link href={{pathname, hash}}>
          <a>
            <div className="middle">
              {user && (
                <div>
                  <div className="profile-img">
                    <img
                      src={staticUrl(user.avatar || staticUrl('/static/images/icon/icon-default-profile.png'))}
                      alt="프로필 이미지"
                    />
                  </div>
                </div>
              )}
              <div>
                <p>{children}</p>
                <span>방금전</span>
              </div>
            </div>
          </a>
        </Link>
        <span onClick={() => dispatch(delToastAlarm({toastType: 'alarm', alarmId}))}>
          <img
            src={staticUrl('/static/images/icon/icon-alarm-delete.png')}
            alt="close"
          />
        </span>
      </div>
    </StyledToastRendererLi>
  );
};

export default React.memo(ToastRendererItem);
