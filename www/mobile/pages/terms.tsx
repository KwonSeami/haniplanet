import * as React from 'react';
import styled from 'styled-components';
import {$BORDER_COLOR, $FONT_COLOR, $TEXT_GRAY} from '../styles/variables.types';
import {fontStyleMixin} from '../styles/mixins.styles';
import TermList from '../components/terms/TermList';

export const TermListMobile = styled(TermList)`
  padding-top: 10px;
  background-color: #f6f7f9;

  .tab {
    max-width: 680px;
    margin: 0 auto;
    padding: 0 15px 15px;
    box-sizing: border-box;

    li {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      padding-right: 8px;
      margin-right: 10px;
      line-height: 30px;
      ${fontStyleMixin({
        size: 15,
        color: $TEXT_GRAY,
      })};

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        right: -2px;
        transform: translateY(-50%);
        width: 1px;
        height: 8px;
        background-color: ${$BORDER_COLOR};
      }

      &:last-child {
        padding-right: 0;
        margin-right: 0;

        &::after {
          display: none;
        }
      }

      &.on {
        text-decoration: underline;
        ${fontStyleMixin({
          weight: '600',
          color: $FONT_COLOR
        })};
      }
    }
  }

  @media screen and (min-width: 680px) {
    padding-bottom: 40px;

    .tab {
      padding: 0 90px 10px;
      text-align: center;
    }
  }
`;


const PolicyMobile = React.memo(() => (
  <TermListMobile />
));

PolicyMobile.displayName = 'PolicyMobile';
export default PolicyMobile;
