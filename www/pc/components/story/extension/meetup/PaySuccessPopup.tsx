import * as React from 'react';
import styled from 'styled-components';
import Alert, {StyledButton} from '../../../common/popup/Alert';
import {TitleDiv} from '../../../common/popup/base/TitlePopup';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {PopupProps} from '../../../common/popup/base/Popup';
import {$BORDER_COLOR, $THIN_GRAY, $POINT_BLUE, $WHITE} from '../../../../styles/variables.types';
import Confirm, {StyledButtonGroup} from '../../../common/popup/Confirm';
import {useRouter} from 'next/router';

const StyledAlert = styled(Alert)`
  text-align: center;

  .modal-body {
    width: 380px;
  }

  ${TitleDiv} {
    padding: 32px 20px 0;
    border: 0;
  }

  h2 {
    padding-bottom: 28px;
    border-bottom: 1px solid ${$BORDER_COLOR};
    ${fontStyleMixin({
      size: 21,
      weight: '300'
    })}
  }

  ${StyledButton} {
    border-color: ${$THIN_GRAY};
    color: #999;
  }
`;

const StyledConfirm = styled(Confirm)`
  .modal-body {
    text-align: center;
    width: 380px;
    min-height: 171px;

    ${TitleDiv} {
      padding: 30px 20px 0;
      border: 0;
      
      h2 {
        padding-bottom: 10px;
        ${fontStyleMixin({
          size: 21,
          weight: '300'
        })}
      }
    }
    
    p {
      letter-spacing: -1.1px;
    }
    
    ${StyledButtonGroup} {
      padding-top: 20px;

      button.left-button {
        color: ${$POINT_BLUE};
        border-color: ${$POINT_BLUE};
      }
        
      button.right-button {
        background-color: #499aff;
        color: ${$WHITE}
      }
    }
  }
`;

interface Props extends PopupProps {
  bandSlug?: string;
  bandName: string;
}

const PaySuccessPopup = React.memo<Props>(
  ({id, closePop, bandName, bandSlug}) => {
    const router = useRouter();
    const _bandName = bandName.length > 10
      ? bandName.substr(0,9) + '...'
      : bandName
    ;

    return (
      bandSlug ? (
        <StyledConfirm
          id={id}
          closePop={closePop}
          title="강의 유의사항 안내"
          buttonGroupProps={{
            leftButton: {
              children: '확인',
              onClick: () => closePop(id),
            },
            rightButton: {
              children: '강의실가기',
              onClick: () => router.push(`/onclass/${bandSlug}`),
            },
          }}
        >
          <p>
            결제 및 해당 온라인강의실 가입이 완료되었습니다. <br/>
            [{_bandName}]강의 시청은 <br/>온라인강의에서 가능합니다.
          </p>
        </StyledConfirm>
      ) : (
        <StyledAlert
          id={id}
          closePop={closePop}
          title='정상처리 되었습니다.'
        >
        </StyledAlert>
      )
    );
  }
);
export default PaySuccessPopup;
