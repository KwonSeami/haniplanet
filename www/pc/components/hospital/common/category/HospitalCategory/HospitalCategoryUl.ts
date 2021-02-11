import styled from 'styled-components';
import {fontStyleMixin, heightMixin, radiusMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR} from '../../../../../styles/variables.types';

const HospitalCategoryUl = styled.ul`
  position: relative;
  margin-top: 12px;

  > li {
    position: relative;
    display: inline-block;
    width: 80px;
    ${heightMixin(80)};
    margin-left: 6px;
    border: 1px dashed ${$BORDER_COLOR};
    border-radius: 15px;
    box-sizing: border-box;
    text-align: center;
    vertical-align: top;
    cursor: pointer;

    &:first-child {
      margin-left: 0;
    }

    &.on {
      line-height: inherit;
      padding: 10px 0;
      ${radiusMixin('15px', '#eee')};

      > img {
        width: 38px;
      }

      button {
        position: absolute;
        top: -1px;
        right: -1px;

        img {
          width: 19px;
        }
      }
    }

    &.pointer:hover {
      background-color: #f9f9f9;
    }

    > img {
      width: 12px;
    }

    p {
      ${fontStyleMixin({size: 12, color: '#999'})};
    }
  }
`;

export default HospitalCategoryUl;
