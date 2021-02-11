import * as React from 'react';
import Alert, {StyledButton} from '../../common/popup/Alert'
import styled from 'styled-components';
import {TitleDiv} from '../../common/popup/base/TitlePopup';
import {$FONT_COLOR, $BORDER_COLOR} from '../../../styles/variables.types';
import Radio from '../../UI/Radio/Radio';
import {cancelMeetupThunks} from '../../../src/reducers/orm/user/thunks';
import {useDispatch} from 'react-redux';
import Router from 'next/router';

const StyledAlert = styled(Alert)`
  .modal-body {
    width: 390px;

    ${TitleDiv} {
      border: 0;
      
      h2 {
        font-size: 19px;
        padding: 4px 21px 0;
        letter-spacing: -1.7px;
      }
    }

    ${StyledButton} {
      margin: 16px auto 30px;
    }
  }
`;

const Ul = styled.ul`
  padding: 0 22px;

  li {
    padding-top: 14px;

    label {
      color: ${$FONT_COLOR};
    }
    textarea {
      margin-top: 14px;
      height: 80px;
      padding: 10px 12px;
      border: 1px solid ${$BORDER_COLOR};
      box-sizing: border-box;
    }
  }
`;

const CANCEL_TYPE = [
  '신청 실수',
  '해당 날짜에 참석 불가',
  '불필요한 내용의 세미나',
  '다른 유사 세미나 참석',
];

const REASON_DIRECT_INPUT = '기타 입력';

interface Props {
  myId: HashId;
  applyPk: HashId;
}

const CancelPopup = React.memo<Props> (
  ({id, closePop, myId, applyPk}) => {

    const dispatch = useDispatch();

    // STATE
    const [cancel_type, setCancelType] = React.useState(null);
    const [reason, setReason] = React.useState('');

    return (
      <StyledAlert
        id={id}
        closePop={closePop}
        title="취소 사유를 선택해주세요."
        buttonProps={{
          onClick: () => {
            if (!cancel_type) {
              alert('취소 사유를 선택해주세요');
            } else {
              const cancel_reason = cancel_type === REASON_DIRECT_INPUT
              ? reason
              : cancel_type;
              dispatch(cancelMeetupThunks(
                myId,
                applyPk,
                {cancel_reason},
                () => Router.reload()
              ));
            }
          },
        }}
      >
        <Ul>
          {CANCEL_TYPE.map(item => (
            <li key={item}>
              <Radio
                checked={cancel_type === item}
                onClick={() => setCancelType(item)}
              >
                {item}
              </Radio>
            </li>
          ))}
          <li>
            <Radio
              checked={cancel_type === REASON_DIRECT_INPUT}
              onClick={() => setCancelType(REASON_DIRECT_INPUT)}
            >
              기타 입력
            </Radio>
            <textarea
              value={reason}
              onClick={() => setCancelType(REASON_DIRECT_INPUT)}
              onChange={e => setReason(e.target.value)}
              maxLength={50}
              placeholder="50자 이내 입력"
            />
          </li>
        </Ul>
      </StyledAlert>
    )

});

CancelPopup.displayName = 'CancelPopup';
export default CancelPopup;