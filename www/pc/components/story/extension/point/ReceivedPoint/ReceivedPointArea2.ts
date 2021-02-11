import styled from 'styled-components';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $POINT_BLUE, $WHITE} from '../../../../../styles/variables.types';

const ReceivedPointArea2 = styled.div`
  position: relative;
  width: 240px;
  height: 40px;
  margin: 0 auto 14px;
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
      color: $POINT_BLUE,
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
      family: 'Montserrat',
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

  .point-box {
    display: none;
    position: absolute;
    right: -183px;
    bottom: -63px;
    width: 250px;
    height: 67px;
    z-index: 2;
    padding: 15px 20px 14px;
    border-radius: 11px;
    box-sizing: border-box;
    box-shadow: 0 2px 3px 0 rgba(168, 168, 168, 0.2);
    border: 1px solid ${$BORDER_COLOR};
    background-color: ${$WHITE};

    p {
      font-size: 12px;
      text-align: left;
    }
  }
  
  .receive-star-btn {
    display: inline-block;
    vertical-align: middle;
    margin-left: 5px;
  }

  .receive-star-btn:hover + .point-box {
    display: block;
  }
`;

export default ReceivedPointArea2;
