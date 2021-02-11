import styled from 'styled-components';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$POINT_BLUE} from '../../../../../styles/variables.types';

const ReceivedPointArea = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 9px 0 10px;
  border-top: 1px solid #eee;
  box-sizing: border-box;

  @media screen and (max-width: 680px) {
    padding: 9px 15px 10px;
  }

  img {
    width: 15px;
    height: 15px;
    margin: 1px 4px 0 0;
  }

  h3 {
    font-size: 13px;
  }

  & > p {
    flex: 1;
    vertical-align: middle;
    text-align: right;
    ${fontStyleMixin({
      size: 18,
      weight: '300',
      color: $POINT_BLUE,
      family: 'Montserrat'
    })}
  }

  button {
    margin-left: 10px;

    img {
      vertical-align: middle;
      width: 5px;
      height: 11px;
      margin: -3px 0 0 3px;
    }
  }
`;

export default ReceivedPointArea;
