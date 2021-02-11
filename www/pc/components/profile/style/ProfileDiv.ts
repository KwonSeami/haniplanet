import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$GRAY, $TEXT_GRAY} from '../../../styles/variables.types';

const ProfileDiv = styled.div`
  background-color: #f9f9f9;

  & > div {
    position: relative;
    width: 680px;
    margin: auto;
    box-sizing: border-box;
    padding: 33px 0 30px 99px;

    & > span {
      display: block;
      position: absolute;
      right: 0;
      bottom: 10px;
      ${fontStyleMixin({size: 11, color: $TEXT_GRAY})};
    }
  }

  h2 {
    letter-spacing: -1.5px;
    ${fontStyleMixin({size: 22, weight: '300'})};
  }

  p {
    ${fontStyleMixin({size: 14, weight: '300', color: $TEXT_GRAY})};
    
    span {
      ${fontStyleMixin({weight: '300', color: $GRAY})};
    }
  }  
`;

export default ProfileDiv;
