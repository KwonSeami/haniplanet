import * as React from 'react';
import styled from 'styled-components';
import {$BORDER_COLOR, $FONT_COLOR, $WHITE} from '../styles/variables.types';
import {fontStyleMixin, heightMixin} from '../styles/mixins.styles';
import TermList from '../components/terms/TermList';

export const TermListPC = styled(TermList)`
  padding: 37px 0 100px;
  mix-blend-mode: multiply;
  background-color: #f6f7f9;

  & > h2 {
    width: 900px;
    margin: auto;
    padding-bottom: 41px;
    ${fontStyleMixin({
      size: 30,
      weight: '300'
    })};
  }

  .tab {
    position: relative;
    width: 900px;
    height: 56px;
    margin: auto;
    box-sizing: border-box;
    border-bottom: 1px solid ${$FONT_COLOR};
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: ${$BORDER_COLOR};
    }

    .slick-track {
      > div:last-of-type {
        div::after {
          display: none;
        }
      }
    }

    .term-item {
      position: relative;
      ${heightMixin(56)};
      vertical-align: middle;
      text-align: center;
      ${fontStyleMixin({
        size: 16, 
        weight: '300', 
        color: '#999'
      })};
      cursor: pointer;
      box-sizing: border-box;

      &::after {
        content: '';
        position: absolute;
        top: 20px;
        right: 0;
        width: 1px;
        height: 15px;
        background-color: ${$BORDER_COLOR};
      }

      &.on, &:hover {
        border: 1px solid ${$FONT_COLOR};
        background-color: ${$WHITE};
        ${fontStyleMixin({
          weight: '600',
          color: $FONT_COLOR
        })};

        &::after {
          display: none;
        }
      }
    }
  }
`;

const PolicyPC = React.memo(() => {
  return (
    <TermListPC/>
  );
});

PolicyPC.displayName = 'PolicyPC';
export default PolicyPC;
