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

  p {
    min-height: 80px;
    padding: 10px 12px;
    border: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;
  }
`

interface Props {
  reason: string;
  destroyType?: string;
}

const CanceledPopup = React.memo<Props> (
  ({id, closePop, reason, destroyType}) => {
    const popupName = destroyType.indexOf('exchange') > -1 ? '교환' : '환불';

    return (
      <StyledAlert
        id={id}
        closePop={closePop}
        title={`${popupName} 상세`}
        buttonProps={{
          onClick: () => {
            closePop&& closePop();
          },
        }}
      >
        <Div>
          <p>{reason}</p>
        </Div>
      </StyledAlert>
    )
  });

CanceledPopup.displayName = 'CanceledPopup';
export default CanceledPopup;