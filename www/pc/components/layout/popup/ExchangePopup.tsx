import * as React from 'react';
import Router from 'next/router';
import Alert, {StyledButton} from '../../common/popup/Alert'
import styled from 'styled-components';
import {TitleDiv} from '../../common/popup/base/TitlePopup';
import {$BORDER_COLOR} from '../../../styles/variables.types';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import UserApi from '../../../src/apis/UserApi';
import {IStoryGoods} from '../../../src/@types/shopping';

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

const Div = styled.div`
  margin-top: 14px;
  padding: 0 22px;

  textarea {
    height: 80px;
    padding: 10px 12px;
    border: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;
  }
`

interface Props {
  userId: HashId;
  applyPk: HashId;
  destroyType?: string;
  onSuccess?: (response: IStoryGoods) => void;
}

const ExchangePopup = React.memo<Props> (
  ({id, closePop, userId, applyPk, destroyType, onSuccess}) => {
    const userApi = useCallAccessFunc(access => new UserApi(access));
    // STATE
    const [reason, setReason] = React.useState('');
    const popupName = destroyType === 'exchange' 
      ? '교환' 
      : destroyType === 'refund'
        ? '환불'
        : '취소';

    return (
      <StyledAlert
        id={id}
        closePop={closePop}
        title={`${popupName} 사유를 입력해주세요.`}
        buttonProps={{
          onClick: () => {
            if (!reason) {
              alert(`${popupName} 사유를 입력해주세요`);
              return false;
            } else {
              userApi.cancelApply(userId, applyPk, {
                cancel_reason: reason,
                destroy_type: destroyType
              }).then(({status, data}) => {
                if(Math.floor(status/100) === 2) {
                  alert(`정상적으로 ${popupName}신청이 되었습니다.`);
                  onSuccess ? onSuccess(data) : Router.reload();
                } else {
                  alert('서버오류가 발생하였습니다.');
                  closePop && closePop();
                }
              });
            }
          },
        }}
      >
        <Div>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            maxLength={50}
            placeholder="50자 이내 입력"
          />
        </Div>
      </StyledAlert>
    )
  });

ExchangePopup.displayName = 'ExchangePopup';
export default ExchangePopup;