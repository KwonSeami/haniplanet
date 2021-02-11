import styled from 'styled-components';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $POINT_BLUE, $WHITE} from '../../../../../styles/variables.types';

const ReceivedPointArea = styled.div`
  position: absolute;
  display: table;
  top: 13px;
  right: 20px;
  min-height: 27px;
  box-sizing: border-box;

  h3 {
    display: table-cell;
    vertical-align: middle;
    padding-right: 6px;
    ${fontStyleMixin({
      size: 12,
      weight: 'bold',
    })}
  }

  & > p {
    display: table-cell;
    vertical-align: middle;
    ${fontStyleMixin({
      size: 18,
      weight: '300',
      color: $POINT_BLUE,
      family: 'Montserrat',
    })}

    img {
      width: 15px;
      display: inline-block;
      vertical-align: middle;
      margin: -3px 3px 0 0;
    }
  }

  button {
    margin-left: 10px;
    border: 1px solid #cbe2ff;
    background-color: ${$WHITE};

    img {
      vertical-align: middle;
      width: 5px;
      margin: -2px 0 0 3px;
    }

    &:hover {
      background-color: #f1f7ff;

      & + .point-box {
        display: block;
      }
    }
  }

  .point-box {
    display: none;
    position: absolute;
    right: 0;
    bottom: -70px;
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
`;

export default ReceivedPointArea;
