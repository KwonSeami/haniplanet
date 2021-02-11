import React from 'react';
import styled from 'styled-components';
import Alert from '../../common/popup/Alert';
import {PopupProps} from '../../common/popup/base/Popup';
import {TitleDiv, Close} from '../../common/popup/base/TitlePopup';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $GRAY, $WHITE, $FLASH_WHITE} from '../../../styles/variables.types';
import A from '../../UI/A';
import {IPlanetNews} from '../../../src/reducers/main';

const StyledAlert = styled(Alert)`
  .modal-body {
    width: 300px;
    min-width: 300px;

    ${TitleDiv} {
      padding: 21px 20px 0;
      border: 0;

      h2 {
        ${fontStyleMixin({
          size: 19,
          weight: '300'
        })};

        p {
          line-height: 20px;
          margin-top: 7px;
          ${fontStyleMixin({
            size: 13,
            color: '#999'
          })};
        }
      }

      ${Close} {
        right: 11px;
        top: 11px;
      }
    }

    .popup-child {
      padding: 19px 20px 0;
    }

    button {
      margin: 29px auto 28px;
    }
  }
`;

const UrlDiv = styled.div`
  height: 41px;
  margin-bottom: 7px;
  
  div {
    display: inline-block;
    height: 100%;
    border: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;
    vertical-align :middle;
  }

  .news-logo {
    width: 102px;
    ${heightMixin(41)};
    background-color: ${$WHITE};
    text-align: center;

    img {
      height: 20px;
      vertical-align: middle;
    }
  }

  .news-url {
    width: 160px;
    line-height: 39px;
    padding: 0 17px 0 12px;
    margin-left: -2px;
    background-color: ${$FLASH_WHITE};
    ${fontStyleMixin({
      size: 11,
      color: $GRAY
    })};
  }
`;

interface Props extends PopupProps {
  newspaper: Dig<IPlanetNews, 'newspaper'>;
}

const NewsUrlPopup: React.FC<Props> = ({
  id,
  closePop,
  newspaper
}) => (
  <StyledAlert
    id={id}
    closePop={closePop}
    buttonText="닫기"
    title={
      <>
        신문사 선택
        <p>
          한의플래닛에서는 회원 여러분들의 더 좋은 콘텐츠 접근을 위해, 신문사 url을 제공해드립니다!
        </p>
      </>
    }
  >
    {Object.values(newspaper).map(({
      id,
      name,
      avatar,
      address
    }) => (
      <UrlDiv key={id}>
        <div className="news-logo">
          <img
            src={avatar}
            alt={name}
          />
        </div>
        <A
          to={address}
          newTab
        >
          <div className="news-url ellipsis">{address}</div>
        </A>
      </UrlDiv>
    ))}
  </StyledAlert>
);

NewsUrlPopup.displayName = 'NewsUrlPopup';
export default React.memo(NewsUrlPopup);
