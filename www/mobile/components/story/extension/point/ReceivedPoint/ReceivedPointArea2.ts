import styled from 'styled-components';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $POINT_BLUE, $WHITE} from '../../../../../styles/variables.types';

const ReceivedPointArea = styled.div`
  position: relative;
  width: 240px;
  height: 40px;
  margin: 0 auto 10px;
  padding: 6px 16px 7px 52px;
  border-radius: 20px;
  text-align: right;
  box-sizing: border-box;
  background-color: #edf5ff;

  h3 {
    position: absolute;
    left: 16px;
    top: 14px;
    ${fontStyleMixin({
      size: 11,
      weight: '600',
      color: $POINT_BLUE
    })}
  }

  & > p {
    width: 100%;
    display: inline-block;
    vertical-align: middle;
    ${fontStyleMixin({
      size: 24,
      weight: '300',
      color: $POINT_BLUE,
      family: 'Montserrat'
    })}

    img {
      width: 15px;
      display: inline-block;
      vertical-align: middle;
      margin: -4px 3px 0 0;
    }
  }

  &.canSendPoint {
    padding-right: 7px;

    & > p {
      width: calc(100% - 65px);
    }
  }
  
  .receive-star-btn {
    display: inline-block;
    vertical-align: middle;
    margin-left: 5px;
  }
`;

export default ReceivedPointArea;
