import styled from 'styled-components';
import {staticUrl} from '../../../src/constants/env';
import {backgroundImgMixin} from '../../../styles/mixins.styles';

const AvatarDiv = styled.div<Pick<IProfileBasicInfo, 'backgroundImg'>>`
  width: 75px;
  height: 75px;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 19px;
  ${props => backgroundImgMixin({
    img: props.backgroundImg || staticUrl('/static/images/icon/icon-large-profile.png'),
    size: 'cover',
  })};

  button {
    position: absolute;
    bottom: -4px;
    right: -4px;
    font-size: 0;

    img {
      width: 19px;
    }
  }
`;

export default AvatarDiv;