import * as React from 'react';
import {PopupProps} from '../../common/popup/base/Popup';
import styled from 'styled-components';
import Confirm, {StyledButtonGroup} from '../../common/popup/Confirm';
import {TitleDiv, Close} from '../../common/popup/base/TitlePopup';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR, $BORDER_COLOR, $POINT_BLUE} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import {useRouter} from 'next/router';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import UserApi from '../../../src/apis/UserApi';
import {useDispatch} from 'react-redux';
import {updateUser} from '../../../src/reducers/orm/user/userReducer';

const StyledConfirm = styled(Confirm)`
  .modal-body {
    width: 580px;

    ${TitleDiv} h2 {
      position: relative;
      padding: 2px 0 3px 37px;
      ${fontStyleMixin({
        size: 15,
        weight: 'bold'
      })}

      &::after {
        content: '';
        position: absolute;
        top: 10px;
        left: 20px;
        width: 11px;
        height: 5px;
        background-color: ${$FONT_COLOR};
      }
    }

    ${Close} {
      top: 12px;
    }

    ${StyledButtonGroup} {
      border-top: 1px solid ${$BORDER_COLOR};
    }
  }
`;

const Div = styled.div`
  position: relative;
  padding: 41px 26px 41px 150px;

  img {
    position: absolute;
    width: 73px;
    top: 50%;
    left: 45px;
    margin-top: -35px;
  }

  p {
    font-size: 17px;

    strong {
      color: ${$POINT_BLUE};
    }

    span {
      display: block;
      padding-top: 16px;
      font-size: 14px;
      line-height: 1.5;
      text-decoration: underline;
    }
  }
`;

interface Props extends PopupProps {
  myId: HashId;
}

const PasswordPopup: React.FC<Props> = React.memo(
  ({id, closePop, myId}) => {
    const router = useRouter();
    
    const userApi: UserApi = useCallAccessFunc(access => access && new UserApi(access));
    const dispatch = useDispatch();

    return (
      <StyledConfirm
        id={id}
        closePop={closePop}
        title="비밀번호 변경 안내"
        buttonGroupProps={{
          leftButton: {
            children: '지금 변경하기', 
            onClick: () => {
              router.push('/user/profile/edit', '/user/profile/edit');
            }
          },
          rightButton: {
            children: '나중에 변경하기',
            onClick: () => {
              userApi.delayPasswordWarnedAt()
                .then(({data: {result}}) => {
                  !!result && dispatch(updateUser(myId, result));
                });
            }
          }
        }}
      >
        <Div>
          <img
            src={staticUrl("/static/images/icon/icon-password.png")}
            alt="비밀번호 변경 안내"
          />
          <p>
            한의플래닛에서는 회원님의 개인정보보호를 위해 주기적 <strong>(6개월)</strong>
            으로 <strong>비밀번호 변경을 권장</strong>하고 있습니다.
            <span>
              비밀번호 변경을 원하지 않을 경우 "나중에 변경하기"버튼을 눌러
              1개월 동안 안내를 받지 않을 수 있습니다.
            </span>
          </p>
        </Div>
      </StyledConfirm>
    );
  }
);

PasswordPopup.displayName = 'PasswordPopup';
export default PasswordPopup;
