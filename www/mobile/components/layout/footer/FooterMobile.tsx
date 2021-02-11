import * as React from 'react';
import styled from 'styled-components';
import FooterLinks from './FooterLinks';
import FooterMenu from './FooterMenu';
import {$WHITE, $POINT_BLUE, $GRAY, $TEXT_GRAY, $BORDER_COLOR} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {numberWithCommas} from '../../../src/lib/numbers';
import UserApi from '../../../src/apis/UserApi';

const Footer = styled.footer`
`;

const TitleDiv = styled.div`
  position: relative;
  background-color: ${$WHITE};
  padding: 17px 20px 19px;
  border-top: 1px solid ${$BORDER_COLOR};

  h2 {
    ${fontStyleMixin({
      size: 14,
      weight: 'bold'
    })};
  }

  p {
    position: absolute;
    left: 101px;
    top: 15px;
    font-size: 15px;

    &::before {
      content: '';
      position: absolute;
      left: -12px;
      top: 5px;
      width: 1px;
      height: 12px;
      background-color: ${$GRAY};
    }

    span {
      display: inline-block;
      vertical-align: middle;
      margin-top: -5px;
      padding-right: 3px;
      ${fontStyleMixin({
        size: 20,
        weight: '300',
        family: 'Montserrat',
        color: $POINT_BLUE
      })};
    }
  }

  .footer-links {
    position: absolute;
    right: 14px;
    top: 12px;

    li {
      padding-right: 6px;

      img {
        width: 29px;
      }
    }
  }
`;

const InfoDiv = styled.div`
  background-color: #222;

  p {
    padding: 0 20px 60px;
    ${fontStyleMixin({
      size: 12,
      weight: 'bold',
      color: $GRAY
    })};
  }
`;

const H2 = styled.h2`
  padding: 22px 20px 27px;
  ${fontStyleMixin({
    size: 14,
    weight: 'bold',
    color: $WHITE
  })};
`;

const Address = styled.address`
  padding: 0 20px 13px;
  font-style: normal;
  line-height: 1.6;
  ${fontStyleMixin({
    size: 12,
    color: $TEXT_GRAY
  })};

  span {
    color: ${$GRAY};
    padding: 0 7px;
  }
`;

const FooterMobile = React.memo(() => {
  const [userCount, setUserCount] = React.useState(null);

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
        <FooterLinks />
      </TitleDiv>
      <InfoDiv>
        <FooterMenu />
        <H2>(주)버키</H2>
        <Address>
          서울시 강남구 논현로 340, 3층(역삼동, 정도빌딩) &nbsp;&nbsp;Tel : 02-6941-4860<span>|</span>Fax : 02-2138-2141
        </Address>
        <Address>
          대표자 : 김현호, 전상호<span>|</span>사업자등록번호 : 381-88-00362<span>|</span>통신판매신고번호 : 제2017-서울강남-03776호<span>|</span>개인정보관리자 : 김현호, 전상호<span>|</span>고객센터 : customer@balky.kr
        </Address>

        <p>Copyright&copy; BALKY All rights reserved</p>
      </InfoDiv>
    </Footer>
  );
});

export default FooterMobile;
