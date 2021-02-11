import styled from 'styled-components';
import ButtonGroup from '../../inputs/ButtonGroup';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE} from '../../../styles/variables.types';

const ProfileButtonGroup = styled(ButtonGroup)`
  position: absolute;
  right: 0;
  top: 15px;

  li {
    padding-left: 5px;
  }

  button {
    width: 95px;
    height: 30px;
    border: 1px solid ${$BORDER_COLOR};
    border-radius: 0;
    ${fontStyleMixin({size: 11, weight: 'bold'})}

    img {
      width: 15px;
      display: inline-block;
      vertical-align: middle;
      margin: -2px 2px 0 0;
    }

    &:hover {
      border-color: ${$FONT_COLOR};
    }

    &.left-button:hover {
      border-color: ${$POINT_BLUE};
    }
  }
`;

export default ProfileButtonGroup;