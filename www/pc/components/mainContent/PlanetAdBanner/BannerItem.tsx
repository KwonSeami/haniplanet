import React from 'react';
import styled from 'styled-components';
import A from '../../UI/A';
import {backgroundImgMixin} from '../../../styles/mixins.styles';

const AdBannerImg = styled.div<Pick<Props, 'avatar'>>`
  position: relative;
  height: 196px;
  
  ${({avatar}) => backgroundImgMixin({
    img: avatar
  })};
`;

interface Props {
  avatar: string;
  url: string;
}

const BannerItem: React.FC<Props> = ({avatar, url}) => (
  <A
    to={url}
    newTab
  >
    <AdBannerImg avatar={avatar}/>
  </A>
);

export default React.memo(BannerItem);
