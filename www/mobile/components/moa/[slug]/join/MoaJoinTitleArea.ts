import styled from 'styled-components';
import {staticUrl} from '../../../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin} from '../../../../styles/mixins.styles';
import {$GRAY} from '../../../../styles/variables.types';

interface IMoaJoinTitleProps {
  avatar: string;
}

const MoaJoinTitleArea = styled.div<IMoaJoinTitleProps>`
  padding: 20px 25px;
  position: relative;
  text-align: left;

  @media screen and (max-width: 680px) {
    padding: 25px 15px;
  }
  
  div.moa-avatar {
    position: absolute;
    right: 52px;
    top: 16px;
    ${({avatar}) => backgroundImgMixin({
      img: avatar || staticUrl('/static/images/icon/icon-default-moa-img.png'),
    })};
    width: 40px;
    height: 40px;
    border-radius: 50%;
  
    img {
      position: absolute;
      right: -30px;
      bottom: 0px;
      width: 40px;
    }
  }
  
  h2.title {
    padding: 0 70px 25px 0;
    ${fontStyleMixin({size: 24, weight: '300'})};
  }
  
  p.desc {
    line-height: 1.7;
    ${fontStyleMixin({size: 13, color: $GRAY})};
  }
`;

export default MoaJoinTitleArea;
