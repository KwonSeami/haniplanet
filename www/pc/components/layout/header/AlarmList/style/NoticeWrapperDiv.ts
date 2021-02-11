import styled from 'styled-components';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $POINT_BLUE, $WHITE} from '../../../../../styles/variables.types';


const NoticeWrapperDiv = styled.div`
  position: absolute;
  top: 52px;
  right: -4px;
  z-index: 10;
  width: 400px;
  max-height: 400px;
  box-sizing: border-box;
  background-color: ${$WHITE};
  border: 1px solid ${$POINT_BLUE};
  border-radius: 20px;
  -ms-overflow-style: none;
  overflow: hidden;

  .read-all{
    position: absolute;
    bottom:0;
    width: 100%;
    height: 33px;
    background-color: ${$WHITE};
    border-top: 1px solid ${$BORDER_COLOR};
  
    &:hover span {
      text-decoration: underline;
    }

    span {
      position: absolute;
      cursor: pointer;
      right: 20px;
      top: 50%;
      margin-top: -10px;
      ${fontStyleMixin({
        size: 12,
        weight: '600',
        color: $POINT_BLUE
      })};
    }
  }
`;

export default NoticeWrapperDiv;
