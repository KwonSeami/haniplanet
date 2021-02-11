import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$WHITE, $GRAY, $FONT_COLOR} from '../../../styles/variables.types';

const PolicyDiv = styled.div`
  position: relative;
  max-width: 680px;
  margin: auto;
  padding: 75px 30px 32px;
  box-sizing: border-box;
  background-color: ${$WHITE};

  .select-box {
    position: absolute;
    right: 13px;
    top: 2px;
    width: 115px;

    p {
      height: 36px;
    }
  }

  dd, dd li, dd p, dd h3 {
    line-height: 1.8;
    ${fontStyleMixin({size: 14, color: $GRAY})}

    b {
      color: ${$FONT_COLOR};
    }
  }

  .policy-top-text {
    padding: 20px 0 23px;
    line-height: 1.8;
    ${fontStyleMixin({size: 14, color: $GRAY})}
  }

  dt {
    padding-top: 30px;
    line-height: 1.8;
    ${fontStyleMixin({
      size: 18, 
      weight: '600'
    })};

    &:first-of-type {
      padding-top: 0;
    }
  }

  h2 {
    font-size: 24px;
    font-weight: 600;
  }

  h3 {
    padding-bottom: 5px;
    font-size: 20px;
    text-decoration: underline;
  }

  em {
    font-style: normal;
    text-decoration: underline;
  }

  .payment-agreement-refund {
    padding-top: 30px;
  }

  dl ~ dl {
    dt > h2 {
      margin-top: 75px;
    }
  }

  dd {
    > p ~ ul {
      margin-top: 20px;
    }

    > ul > li {
      & ~ li {
        margin-top: 20px;
      }
    }

    &.no-margin > ul > li ~ li {
      margin-top: 0;
    }
  }
`;

export default PolicyDiv;