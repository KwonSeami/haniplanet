import * as React from 'react';
import styled from 'styled-components';
import FooterLinks from './FooterLinks';
import FooterMenu from './FooterMenu';
import {$TEXT_GRAY, $WHITE} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {useSelector, shallowEqual} from 'react-redux';

const StyledFooter = styled.footer`
  background-color: #222;

  .footer-wrap {
    position: relative;
    width: 1090px;
    margin: auto;
    padding: 33px 0 55px;
    box-sizing: border-box;

    h2 {
      padding-bottom: 27px;
      ${fontStyleMixin({
        size: 14,
        weight: '600',
        color: $WHITE
      })}
    }

    & > p {
      padding-top: 16px;
      border-top: 1px solid #666;
      ${fontStyleMixin({
        size: 12,
        color: '#666'
      })}
    }

    address {
      padding-bottom: 20px;
      font-style: normal; 
      line-height: 1.7;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })}

      span {
        display: block;
        padding-top: 12px;
      }
    }
  }

  .footer-menu-wrap {
    position: absolute;
    right: 0;
    top: 35px;

    .footer-menu {
      width: 264px;
      margin-right: 160px;
      box-sizing: border-box;
      
      li {
        padding: 0 0 21px 0;
        width: 50%;

        a {
          color: ${$TEXT_GRAY};

          &:hover {
            text-decoration: underline;
            color: ${$WHITE};
          }
        } 
      }
    }

    .footer-links {
      position: absolute;
      right: 0;
      top: 0;

      img {
        width: 29px;

        &:hover {
          opacity: 0.4;
        }
      }
    }
  }
`; 

const Footer = React.memo(() => {
  const isPCFooterShow = useSelector(
    ({system: {style: {footer: {isFooterShow}}}}) => isFooterShow,
    shallowEqual
  );

  return isPCFooterShow && (
    <StyledFooter className="clearfix">
      <div className="footer-wrap">
        <h2>(주)버키</h2>
        <address>
          서울시 강남구 논현로 340, 3층(역삼동, 정도빌딩)<br />
          Tel : 02-6941-4860&nbsp;&nbsp;|&nbsp;&nbsp;Fax : 02-2138-2141
          <span>
            대표자 : 김현호, 전상호&nbsp;&nbsp;|&nbsp;&nbsp;
            사업자등록번호 : 381-88-00362&nbsp;&nbsp;|&nbsp;&nbsp;
            통신판매신고번호 : 제2017-서울강남-03776호<br />
            개인정보관리자 : 김현호, 전상호&nbsp;&nbsp;|&nbsp;&nbsp;
            고객센터 : customer@balky.kr
          </span>
        </address>
        <div className="footer-menu-wrap">
          <FooterMenu />
          <FooterLinks />
        </div>
        <p>Copyright&copy; BALKY All rights reserved</p>
      </div>
    </StyledFooter>
  );
});

Footer.displayName = 'Footer';
export default Footer;
