import * as React from 'react';
import styled from 'styled-components';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Alert, {StyledButton} from '../../common/popup/Alert';
import Button from '../../inputs/Button';
import {PopupProps} from '../../common/popup/base/Popup';
import {TitleDiv, Close} from '../../common/popup/base/TitlePopup';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import {$POINT_BLUE, $BORDER_COLOR, $TEXT_GRAY, $GRAY, $THIN_GRAY} from '../../../styles/variables.types';

const StyledAlert = styled(Alert)`
  .modal-body {
    width: 400px;

    ${TitleDiv} {
      padding: 20px 22px 0;
      border: 0;

      h2 {
        font-size: 17px;

        img {
          display: inline-block;
          vertical-align: middle;
          margin: -2px 4px 0 0;
          width: 24px;
        }
      }
    }

    ${Close} {
      right: 11px;
      top: 11px;
    }

    ${StyledButton} {
      margin: 17px auto 31px;
      border-color: ${$THIN_GRAY};
      color: #999;
    }
  }
`;

const UrlDiv = styled.div`
  position: relative;
  padding: 13px 25px 0;

  p {
    width: 100%;
    padding: 0 78px 0 13px;
    ${fontStyleMixin({size: 14, color: $TEXT_GRAY})};
    ${heightMixin(40)};
    border: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;
  }

  span {
    display: block;
    padding-top: 5px;
    padding-bottom: 33px;
    ${fontStyleMixin({size: 12, color: $GRAY})};
    letter-spacing: -1.2px;
  }
`;

const StyledCopyButton = styled(Button)`
  position: absolute;
  right: 25px;
  top: 13px;

  &:active {
    background-color: #eff1f4;
  }
`;

interface Props extends PopupProps {
  storyPK: string;
  url?: string;
}

const UrlPopup = React.memo<Props>(
  ({id, closePop, storyPK, url}) => ( 
    <StyledAlert
      id={id}
      closePop={closePop}
      title={
        <>
          <img
            src={staticUrl("/static/images/icon/icon-gray-share.png")}
            alt="해당 글의 URL을 공유합니다."
          />
          해당 글의 URL을 공유합니다.
        </>
      }
      isButtonShow={false}
    >
      <UrlDiv>
        <p className="ellipsis">
          {url || `https://www.haniplanet.com/story/${storyPK}`}
        </p>
        <CopyToClipboard text={url || `https://www.haniplanet.com/story/${storyPK}`}>
          <StyledCopyButton
            backgroundColor="#f5f7f9"
            size={{width: '55px', height: '40px'}}
            font={{size: '14px', color: $POINT_BLUE}}
            border={{radius: '0', width: '1px', color: $BORDER_COLOR}}
            onClick={() => closePop(id)}
          >
            복사
        </StyledCopyButton>
        </CopyToClipboard>
        <span>공유 된 링크는 글 공개 권한에 따라 글의 열람이 불가능 할 수 있습니다. </span>
      </UrlDiv>
    </StyledAlert>  
  )
);

UrlPopup.displayName = 'UrlPopup';
export default UrlPopup;
