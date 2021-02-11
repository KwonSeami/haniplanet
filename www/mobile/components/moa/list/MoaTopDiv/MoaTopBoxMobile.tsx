import * as React from 'react';
import isEqual from 'lodash/isEqual';
import Link from 'next/link';
import {useSelector} from 'react-redux';
import MyMoaListMobile from '../moaList/MyMoaList/MyMoaListMobile';
import {staticUrl} from '../../../../src/constants/env';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';
import {$FONT_COLOR} from '../../../../styles/variables.types';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../../styles/mixins.styles';

const Section = styled.section`
  width: 100%;
  background-color: #f8f6ee;
  max-height: 366px;

  .moa-top-box {
    max-width: 680px;
    box-sizing: border-box;
    position: relative;
    margin: auto;
    padding-top: 15px;
    z-index: 1;

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      top: 60px;
      left: 0;
      background-color: ${$FONT_COLOR};
    }

    @media screen and (max-width: 680px) {
      padding: 15px 20px 6px;

      &::after {
        top: 63px;
        left: auto;
        right: 20px;
        width: 80%;
      }
    }
  }

  .moa-top-box .moa-guide {
    text-align: right;
    padding-bottom: 14px;

    a {
      ${fontStyleMixin({
        size: 12,
        weight: '600'
      })}
    }

    img {
      width: 18px;
      display: inline-block;
      vertical-align: middle;
      margin-top: -5px;
      padding-left: 1px;
    }

    @media screen and (max-width: 680px) {
      padding-bottom: 15px;
      margin-right: 2px;
    }
  }

  .moa-top-box > h2 {
    position: relative;
    z-index: 1;
    display: inline-block;
    background-color:  #f8f6ee;
    font-size: 13px;
    padding-right: 6px;

    span {
      padding-right: 5px;
      ${fontStyleMixin({
        size: 30,
        weight: '300'
      })};
      letter-spacing: -2px;
      vertical-align: middle;
      display: inline-block;
      margin-top: -6px;
    }
  }
`;

const MoaTopBoxMobile = React.memo(
  () => {
    const {name} = useSelector(
      ({orm, system: {session: {id}}}) => (pickUserSelector(id)(orm) || {}),
      (prev, curr) => isEqual(prev, curr)
    );

    return (
      <Section>
        <div className="moa-top-box">
          <p className="moa-guide">
            <Link href="/guide">
              <a>
                MOA 이용가이드
                <img
                  src={staticUrl('/static/images/icon/icon-help-btn.png')}
                  alt="MOA이용가이드"
                />
              </a>
            </Link>
          </p>
          <h2>
            <span>{name}</span>님의 MOA
          </h2>
          <MyMoaListMobile />
        </div>
      </Section>
    );
  }
);

export default MoaTopBoxMobile;
