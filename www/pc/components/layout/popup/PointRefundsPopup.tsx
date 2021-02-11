import * as React from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import Alert, {StyledButton} from '../../common/popup/Alert';
import {PopupProps} from '../../common/popup/base/Popup';
import {TitleDiv} from '../../common/popup/base/TitlePopup';
import {staticUrl} from '../../../src/constants/env';
import {numberWithCommas} from '../../../src/lib/numbers';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $POINT_BLUE, $GRAY} from '../../../styles/variables.types';

const StyledAlert = styled(Alert)`
  .modal-body {
    min-width: 380px;

    ${TitleDiv} {
      padding: 0;
      border: 0;
    }

    ${StyledButton} {
      margin-bottom: 29px;
    }
  }
`;

const PointRefundsDiv = styled.div`
  padding: 34px 0 28px;
  margin: 0 20px;
  text-align: center;
  border-bottom: 1px solid ${$BORDER_COLOR};

  h2 {
    padding-bottom: 11px;
    ${fontStyleMixin({
      size: 21,
      weight: '300'
    })}

    img {
      display: inline-block;
      vertical-align: middle;
      width: 18px;
      margin: -1px 5px 0 0;
    }
  }

  p {
    ${fontStyleMixin({
      size: 14,
      color: $GRAY
    })}

    span {
      color: ${$POINT_BLUE};
    }
  }
`;

interface Props extends PopupProps {
  won: number;
}

const PointRefundsPopup = React.memo<Props>(
  ({id, closePop, won}) => {
    const router = useRouter();

    return (
      <StyledAlert
        id={id}
        closePop={closePop}
        callback={() => router.push({
          pathname: '/user/point',
          query: {tab: 'history', list: 'point_withdrawal'},
        })}
      >
        <PointRefundsDiv>
          <h2>
            <img
              src={staticUrl("/static/images/icon/icon-complete.png")}
              alt="별 환급 완료"
            />
            별 환급 완료
          </h2>
          <p>
            <span>총 {numberWithCommas(won)}원</span>을 요청하신 계좌정보에 환급 요청하였습니다.<br />
            3일 이내 환급처리 완료됩니다.
          </p>
        </PointRefundsDiv>
      </StyledAlert>
    );
  }
);

PointRefundsPopup.displayName = 'PointRefundsPopup';
export default PointRefundsPopup;
