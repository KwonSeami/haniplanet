import React from 'react';
import styled from 'styled-components';
import Alert from '../../common/popup/Alert';
import {PopupProps} from '../../common/popup/base/Popup';
import {TitleDiv, Close} from '../../common/popup/base/TitlePopup';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import {$POINT_BLUE, $BORDER_COLOR, $GRAY, $WHITE, $FLASH_WHITE} from '../../../styles/variables.types';
import A from '../../UI/A';
import {IPlanetNews} from '../../../src/reducers/main';

const StyledAlert = styled(Alert)`
  .modal-body {
    width: 380px;

    ${TitleDiv} {
      padding: 30px 20px 0;
      border: 0;

      h2 {
        font-size: 21px;

        p {
          line-height: 22px;
          margin-top: 8px;
          ${fontStyleMixin({
            size: 14,
            color: $GRAY
          })};
        }
      }

      ${Close} {
        right: 11px;
        top: 11px;
      }
    }

    .popup-child {
      padding: 18px 20px 0;
    }

    button {
      margin: 31px auto 28px;
    }
  }
`;

const UrlDiv = styled.div`
  height: 40px;
  margin-bottom: 7px;

  img {
    height: 20px;
    vertical-align: middle;
  }
  
  div {
    display: inline-block;
    height: 100%;
    border: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;
    vertical-align :middle;
  }

  .news-logo {
    width: 101px;
    ${heightMixin(40)};
    background-color: ${$WHITE};
    text-align: center;
  }

  a {
    display: inline-block;
    width: 240px;
    height: 100%;
    margin-left: -1px;
    box-sizing: border-box;
  }

  .news-url {
    width: 240px;
    line-height: 41px;
    padding-left: 12px;
    background-color: ${$FLASH_WHITE};

    p {
      ${fontStyleMixin({
        size: 11,
        color: $GRAY
      })};
    }

    &:hover p {
      text-decoration: underline;
      color: ${$POINT_BLUE};
    }
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
          한의플래닛에서는 회원 여러분들의 더 좋은 콘텐츠<br/>
          접근을 위해, 신문사 url을 제공해드립니다!
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
          <div className="news-url">
            <p>{address}</p>
          </div>
        </A>
      </UrlDiv>
    ))}
  </StyledAlert>
);

NewsUrlPopup.displayName = 'NewsUrlPopup';
export default React.memo(NewsUrlPopup);
