import styled from 'styled-components';
import {fontStyleMixin, heightMixin, inlineBlockMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE, $WHITE} from '../../../../../styles/variables.types';

const UserFollowBtn = styled.button`
  z-index: 1;
  cursor: pointer;
  position: absolute;
  box-sizing: border-box;
  left: 12px;
  bottom: -11px;
  padding: 0 15px;
  font-size: 11px;
  text-align: center;
  border: 1px solid ${$BORDER_COLOR};
  color: ${$FONT_COLOR};
  background-color: ${$WHITE};
  ${heightMixin(24)};
  
  .is-follow {
    ${fontStyleMixin({size: 11, weight: 'bold', color: $POINT_BLUE})};
  }

  img {
    margin: -3px 0 0;
    ${inlineBlockMixin(7)};
  }
`;

export default UserFollowBtn;
