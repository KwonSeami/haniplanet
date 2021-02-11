import * as React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {PopupProps} from '../../common/popup/base/Popup';
import Confirm, {StyledButtonGroup} from '../../common/popup/Confirm';
import {Close, TitleDiv} from '../../common/popup/base/TitlePopup';

const StyledConfirm = styled(Confirm)`
  .modal-body {
    width: 380px;

    ${TitleDiv} {
      padding: 34px 0 10px;
      border: 0;

      h2 {
        ${fontStyleMixin({size: 21, weight: '300'})}
        letter-spacing: -1.2px;
        text-align: center;
      }
    }

    ${Close} {
      top: 13px;
      right: 12px;
    }

    ${StyledButtonGroup} {
      padding: 20px 0 30px;
      border-top: 1px solid ${$BORDER_COLOR};
      margin: 0 20px;
    }
  }
`;

const Div = styled.div`
  padding: 0 20px 26px;
  text-align: center;

  p {
    padding-bottom: 8px;
    ${fontStyleMixin({size: 14, color: $GRAY})}

    span {
      color: ${$POINT_BLUE};
    }
  }

  & > span {
    display: block;
    ${fontStyleMixin({size: 12, color: $TEXT_GRAY})}
  }
`;

interface Props extends PopupProps {
  auth_id: string;
  created_at: string;
}

const FindResultPopup = React.memo<Props>(
  ({id, closePop, auth_id, created_at, ...rest}) => (
    <StyledConfirm
      id={id}
      closePop={closePop}
      title="아이디 찾기 결과"
      {...rest}
    >
      <Div>
        <p>
          회원님의 아이디는 <span>{auth_id}</span> 입니다.
        </p>
        <span>가입일 : {moment(new Date(created_at)).format('YYYY.MM.DD')}</span>
      </Div>
    </StyledConfirm>
  ),
);

FindResultPopup.displayName = 'FindResultPopup';
export default FindResultPopup;
