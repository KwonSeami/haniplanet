import styled from 'styled-components';
import {staticUrl} from '../../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {$GRAY} from '../../../styles/variables.types';

interface IMoaHeaderAreaProps {
  avatar?: string;
}

const MoaHeaderArea = styled.div<IMoaHeaderAreaProps>`
  position: relative;
  height: 283px;
  text-align: center;
  box-sizing: border-box;
  ${({avatar}) => backgroundImgMixin({
    img: avatar || staticUrl('/static/images/banner/moa-default.png'),
  })};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(246, 247, 249, 0.9);
  }

  h2 {
    position: relative;
    padding-top: 150px;
    ${fontStyleMixin({
      size: 28,
      weight: '300',
    })};
  }

  a {
    position: absolute;
    display: block;
    top: 125px;
    left: 40px;
    ${fontStyleMixin({
      size: 15,
      color: $GRAY,
    })};
    
    img {
      width: 30px;
      display: inline-block;
      vertical-align: middle;
      margin: -5px 11px 0 0;
    }
  }
`;

export default MoaHeaderArea;
