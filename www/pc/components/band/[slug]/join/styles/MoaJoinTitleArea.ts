import styled from 'styled-components';
import {staticUrl} from '../../../../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$GRAY} from '../../../../../styles/variables.types';

interface IMoaImgProps {
  avatar: string;
}

const MoaJoinTitleArea = styled.div<IMoaImgProps>`
  width: 680px;
  margin: auto;
  box-sizing: border-box;
  padding: 25px 5px 25px 101px;
  position: relative;
  
  .moa-avatar {
    position: absolute;
    top: 50%;
    left: 0;
    width: 70px;
    height: 70px;
    margin-top: -36px;
    border-radius: 50%;
    ${({avatar}) => backgroundImgMixin({
      img: avatar || staticUrl('/static/images/icon/icon-default-moa-img.png')
    })};
  
    img {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 24px;
    }
  }
  
  .title {
    padding-bottom: 5px;
    ${fontStyleMixin({size: 17, weight: 'bold'})};
  }
  
  .subtitle {
    line-height: 1.7;
    ${fontStyleMixin({size: 13, color: $GRAY})};
  }
`;

export default MoaJoinTitleArea;
