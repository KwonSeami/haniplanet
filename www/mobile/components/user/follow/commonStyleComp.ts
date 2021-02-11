import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$POINT_BLUE, $TEXT_GRAY, $WHITE} from '../../../styles/variables.types';

export const NoContentText = styled.p`
  text-align: center;
  padding-top: 59px;
  ${fontStyleMixin({size: 14, color: $TEXT_GRAY})}

  img {
    display: block;
    padding-bottom: 9px;
    margin: auto;
    width: 80px;
  }
`;

export const MemberWrapDiv = styled.div`
  position: relative;
  background-color: ${$WHITE};
  padding-bottom: 157px;

  & > h2 {
    padding: 13px 10px 14px 16px;
    font-size: 18px;

    span {
      ${fontStyleMixin({size: 18, weight: '300', color: $POINT_BLUE, family: 'Montserrat'})}
    }
  }
`;