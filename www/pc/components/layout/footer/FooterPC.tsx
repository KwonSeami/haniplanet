import * as React from 'react';
import styled from 'styled-components';
import FooterLinks from './FooterLinks';
import FooterMenu from './FooterMenu';
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {numberWithCommas} from '../../../src/lib/numbers';
import {staticUrl} from '../../../src/constants/env';
import Button from '../../inputs/Button';
import UserApi from '../../../src/apis/UserApi';

const Footer = styled.footer`
  border-top: 2px solid ${$FONT_COLOR};
`;

const TitleDiv = styled.div`
  position: relative;
  padding: 19px 0;

  h2 {
    letter-spacing: -1.9px;
    ${fontStyleMixin({
      size: 15,
      weight: 'bold',
    })};
  }

  p {
    position: absolute;
    right: 0;
    top: 18px;
    font-size: 15px;

    &::before {
      content: '';
      position: absolute;
      left: -20px;
      top: 5px;
      width: 1px;
      height: 12px;
      background-color: ${$BORDER_COLOR};
    }

    span {
      display: inline-block;
      vertical-align: middle;
      margin-top: -6px;
      padding-right: 4px;
      ${fontStyleMixin({
        size: 27,
        weight: '300',
        family: 'Montserrat',
        color: $POINT_BLUE,
      })};
    }
  }
`;

const InfoDiv = styled.div`
  position: relative;
  padding: 17px 16px 0;
  border: 1px solid ${$BORDER_COLOR};
  
  h2 {
    font-size: 14px;
  }

  .footer-links {
    position: absolute;
    right: 9px;
    top: 14px;
  }

  .footer-menu {
    padding: 14px 3px 0;

    li {
      &::after {
        content: '';
        position: absolute;
        right: 8px;
        top: 10px;
        width: 1px;
        height: 15px;
        background-color: ${$BORDER_COLOR};
      }

      &:last-child::after {
        display: none;
      }
    }
  }

  p {
    color: #999;
    padding: 9px 3px 12px;
    letter-spacing: 0;
  }
`;

const StyledButton = styled(Button)`
  border-top: 1px solid ${$BORDER_COLOR};

  img {
    width: 11px;
    
    &.fold {
      display: inline-block;
      vertical-align: middle;
      margin: 5px 0 0 4px;
      transform: rotate(-90deg);
    }
  }
`;

const Address = styled.address`
  padding: 15px 2px;
  border-top: 1px solid ${$BORDER_COLOR};
  font-style: normal;
  line-height: 1.5;

  span {
    display: block;
    padding-top: 12px;
  }
`;

const FooterPC = React.memo(() => {
  const [userCount, setUserCount] = React.useState(null);
  const [toggle, setToggle] = React.useState(false);

  React.useEffect(() => {
    UserApi.allUserCount()
      .then(({data: {count}}) => {
        if (!!count) {
          setUserCount(count);
        }
      });
  }, []);

  return (
    <Footer>
      <TitleDiv>
        <h2>총 회원수</h2>
        <p>
          <span>{numberWithCommas(userCount)}</span>명
        </p>
      </TitleDiv>
      <InfoDiv>
        <h2>(주)버키</h2>
        <FooterLinks/>
        <FooterMenu/>
        <p>Copyright&copy; BALKY All rights reserved</p>
        {toggle && (
          <Address>
            서울시 강남구 논현로 340, 3층(역삼동, 정도빌딩)<br/>
            Tel : 02-6941-4860&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Fax : 02-2138-2141
            <span>
              대표자 : 김현호, 전상호<br/>
              사업자등록번호 : 381-88-00362<br/>
              통신판매신고번호 : 제2017-서울강남-03776호<br/>
              개인정보관리자 : 김현호, 전상호<br/>
              고객센터 : customer@balky.kr
            </span>
          </Address>
        )}
        <StyledButton
          onClick={() => setToggle(curr => !curr)}
          size={{
            width: '100%',
            height: '45px'
          }}
          font={{
            size: '12px'
          }}
          border={{
            radius: '0',
          }}
        >
          {toggle ? (
            <>
              접어두기
              <img
                className="fold"
                src={staticUrl('/static/images/icon/arrow/icon-mini-shortcuts.png')}
                alt="접어두기"
              />
            </>
          ) : (
            <img
              src={staticUrl('/static/images/icon/icon-more.png')}
              alt="더보기"
            />
          )}
        </StyledButton>
      </InfoDiv>
    </Footer>
  );
});

FooterPC.displayName = 'FooterPC';
export default FooterPC;
