import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR, $TEXT_GRAY, $POINT_BLUE} from '../../../styles/variables.types';
import {H3, Div} from '../../UI/ResponsiveLi/ResponsiveLi';

const ProfileListUl = styled.ul`
  width: 680px;
  margin: auto;
  padding: 20px 0 26px;
  box-sizing: border-box;

  & > li {
    padding-bottom: 10px;
    position: relative;

    span {
      display: block;
      padding-top: 5px;
      ${fontStyleMixin({size: 11, color: $TEXT_GRAY})}

      &.error {
        color: #ea6060;
      }
      
      &.info {
        color: ${$FONT_COLOR};
      }
      
      &.success {
        color: ${$POINT_BLUE};
      }
    }

    input.read-only {
      background-color: #f9f9f9;
    }
  }

  ${H3} {
    top: 14px;
  }

  ${Div} {
    padding-left: 102px;
  }
`;

export default ProfileListUl;
