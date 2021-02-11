import styled from 'styled-components';
import {$FLASH_WHITE, $FONT_COLOR, $TEXT_GRAY, $THIN_GRAY} from '../../styles/variables.types';
import {fontStyleMixin} from '../../styles/mixins.styles';

export const FaqWrapperDiv = styled.div`
  margin-bottom: 100px;
`

export const FaqLayoutDiv = styled.div`
  position: relative;
  width: 1035px;
  margin:0 auto;

  &::before,
  &::after {
    display: table;
    clear: both;
    content: '';
  }
`

export const FaqHeader = styled.header`
  width: 100%;
  height: 160px;
  background-color: ${$FLASH_WHITE};
  text-align: center;
  line-height: 1.5;

  &::before {
    display: inline-block;
    width: 1px;
    height: 100%;
    margin-left: -1px;
    vertical-align: middle;
    content: '';
  }

  & > div {
    display: inline-block;
    vertical-align: middle;
  }

  h1 {
    ${fontStyleMixin({
      size: 30,
      color: $FONT_COLOR,
      weight: '100'
    })}
  }

  p {
    ${fontStyleMixin({
      size: 12,
      color: '#999'
    })}
  }

  h1 + p {
    margin-top: 5px;
  }
`;

export const FaqItemDiv = styled.div`
  line-height: 24px;
  ${fontStyleMixin({
    size: 16,
    color: $FONT_COLOR
  })};

  .title {
    position: relative;
    padding-left: 28px;

    &::before {
      position: absolute;
      left: 0;
      top: 0;
      height: 24px;
      line-height: 24px;
      ${fontStyleMixin({
        size: 20,
        color: '#9dd287',
        family: 'Montserrat',
        weight: 'bold'
      })}
      content: 'Q.'
    }

    &.answer::before {
      color: #72a6e8;
      content: 'A.';
    }

    small {
      display: block;
      margin-top: 4px;
    }
  }

  em {
    font-style: normal;
  } 

  small {
    margin-top: 6px;
    line-height: 18px;
    ${fontStyleMixin({
      size: 12,
      color: '#bbb'
    })}

    span {
      position: relative;      
      & ~ span {
        margin-left: 10px;

        &::before {
          position: absolute;
          left: -10px;
          top: 0;
          width: 10px;
          text-align: center;
          content: '·';
          color: ${$THIN_GRAY};
        }
      }

      &.category {
        color: #90b0d7;
      }

      &.kin-url {
        color: #6dc057;
      }

      &.edited {
        display: inline-block;
        padding: 0 7px;
        height: 18px;
        margin-left: 4px;
        line-height: inherit;
        color: #bbb;
        background-color: #f9f9f9;
        border-radius: 9px;

        &::before {
          display: none;
        }
      }
    }
  }

  .tags {
    margin-top: 13px;

    .tag {
      margin-right: 8px;
      padding: 0;
      background-color: #f4f4f4;
      line-height: 18px;
      ${fontStyleMixin({
        size: 14,
        color: $TEXT_GRAY
      })};
    }
  }
`;

export const FAQButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 102px;
  background-color: #f9f9f9;
  
  a:first-child {
    margin-right: 10px;
  }
`;
