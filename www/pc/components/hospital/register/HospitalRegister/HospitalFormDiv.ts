import styled from 'styled-components';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR} from '../../../../styles/variables.types';

const HospitalFormDiv = styled.div`
  width: 1000px;
  box-sizing: border-box;
  margin: -232px auto 44px;

  .hospital-introduction {
    position: relative;
    height: 160px;
    margin: 45px 0 30px;
    padding: 20px 30px;
    border: 1px solid ${$BORDER_COLOR};
    border-top: 1px solid ${$FONT_COLOR};
    box-sizing: border-box;

    h3 {
      position: absolute;
      top: -27px;
      left: -1px;
      ${fontStyleMixin({size: 14, weight: 'bold', color: $FONT_COLOR})};

      &::after {
        content: '*';
        position: absolute;
        top: -3px;
        right: -9px;
        color: #f32b43;
      }
    }
  }
`;

export default HospitalFormDiv;
