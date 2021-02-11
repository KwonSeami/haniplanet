import * as React from 'react';
import {PopupProps} from '../../common/popup/base/Popup';
import styled from 'styled-components';
import Confirm, {StyledButtonGroup} from '../../common/popup/Confirm';
import {TitleDiv, Close} from '../../common/popup/base/TitlePopup';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR, $BORDER_COLOR, $POINT_BLUE} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import UserApi from '../../../src/apis/UserApi';
import {useRouter} from 'next/router';

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
  
  @media screen and (max-width: 680px) {
    .modal-body {
      width: 90%;
    }
  }
`;

const Div = styled.div`
  position: relative;
  padding: 41px 5px 41px 150px;

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
    }
  }

  @media screen and (max-width: 680px) {
    padding: 18px 25px 24px;
    text-align: center;

    img {
      position: static;
      margin: auto;
      display: block;
      width: 90px;
      padding-bottom: 10px;
    }

    p {
      font-size: 15px;
    }
  }
`;

const InactivePopup: React.FC<PopupProps> = React.memo(
  ({id, closePop}) => {
    const router = useRouter();
    const userApi: UserApi = useCallAccessFunc(access => access && new UserApi(access));

    return (
      <StyledConfirm
        id={id}
        closePop={closePop}
        title="휴면계정 안내"
        buttonGroupProps={{
          rightButton: {
            children: '휴면계정풀기',
            onClick: () => {
              userApi.activate()
                .then(({status}) => {
                  if (Math.floor(status / 100) !== 4) {
                    alert('휴면계정이 해제되었습니다.');
                    router.reload();
                  }
                });
            }
          }
        }}
      >
        <Div>
          <img
            src={staticUrl("/static/images/icon/icon-inactive.png")}
            alt="휴면계정 안내"
          />
          <p>
            회원님은 1년 이상 장기 미사용으로 인한<br />
            <strong>휴면계정</strong> 상태 입니다.
            <span>
              아래 버튼을 통해 휴면계정을 해제할 수 있습니다.
            </span>
          </p>
        </Div>
      </StyledConfirm>
    );
  }
);

InactivePopup.displayName = 'InactivePopup';
export default InactivePopup;
