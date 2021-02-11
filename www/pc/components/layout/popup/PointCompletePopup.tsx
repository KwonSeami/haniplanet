import * as React from 'react';
import styled from 'styled-components';
import {PopupProps} from '../../common/popup/base/Popup';
import Alert, {StyledButton} from '../../common/popup/Alert';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {numberWithCommas} from '../../../src/lib/numbers';
import {TitleDiv, Close} from '../../common/popup/base/TitlePopup';
import {$POINT_BLUE, $GRAY} from '../../../styles/variables.types';

const StyledAlert = styled(Alert)`
  .modal-body {
    min-width: 250px;

    ${TitleDiv} {
      padding: 0;
      border: 0;
    }

    ${Close} {
      right: 12px;
      top: 15px;
    }

    ${StyledButton} {
      margin-bottom: 29px;
    }
  }
`;

const PointCompleteDiv = styled.div`
  padding: 29px 0 1px;
  text-align: center;

  img {
    width: 50px;
    height: 50px;
    display: block;
    margin: auto;
    padding-bottom: 7px;
  }

  h2 {
    padding-bottom: 3px;
    ${fontStyleMixin({
      size: 21,
      weight: '300'
    })}
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
  type: 'CHARGE' | 'SEND';
  point: number;
}

const POPUP_TITLE_TEXT = {
  CHARGE: '별 충전 완료',
  SEND: '별 보내기',
};

const POINT_IMAGE = {
  CHARGE: 'icon-complete-point.gif',
  SEND: 'icon-send-point.gif'
};

const PointCompletePopup = React.memo<Props>(
  ({id, closePop, type, point}) => {
    return (
      <StyledAlert
        id={id}
        closePop={closePop}
      >
        <PointCompleteDiv>
          <img
            src={staticUrl(`/static/images/icon/${POINT_IMAGE[type]}`)}
            alt="완료"
          />
          {/* TODO: /static/images/icon/icon-send-point.gif 보내기  */}
          <h2>{POPUP_TITLE_TEXT[type]}</h2>
          <p>
            {type === 'CHARGE' ? (
              <>총 <span>{numberWithCommas(point)}개</span>의 별을 충전하였습니다.</>
            ) : type === 'SEND' && (
              <><span>{numberWithCommas(point)}개</span>의 별을 보냈습니다.</>
            )}
          </p>
        </PointCompleteDiv>
      </StyledAlert>
    );
  }
);

PointCompletePopup.displayName = 'PointCompletePopup';
export default PointCompletePopup;
