import styled from 'styled-components';
import {$TEXT_GRAY, $FONT_COLOR} from '../../../../../styles/variables.types';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';

export const Ul = styled.ul`
  li {
    position: relative;
    float: left;
    padding: 25px 20px 20px 0;
    letter-spacing: -1.3px;
    

    &.on {
      color: ${$FONT_COLOR};
      text-decoration: underline;

      img {
        display: none;

        &.on {
          display: inline-block;
          vertical-align: middle;
        }
      }
    }

    ${fontStyleMixin({
      size: 15,
      weight: '600',
      color: $TEXT_GRAY
    })};
    
    img {
      width: 40px;
      display: inline-block;
      vertical-align: middle;
      margin-top: -2px;
      padding-right: 10px;

      &.on {
        display: none;
      }
    }
  }
`;
