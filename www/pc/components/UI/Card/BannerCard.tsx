import * as React from 'react';
import styled from 'styled-components';
import WaypointHeader from '../../layout/header/WaypointHeader';
import ShowCurrentTab, {ITabItem, TabIndex} from '../ShowCurrentTab';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';

const BannerImgDiv = styled.div<Pick<Props, 'bannerBackground'>>`
  ${props => backgroundImgMixin({
    img: props.bannerBackground
  })};
  height: 280px;

  h2 {
    text-align: center;
    width: 900px;
    margin: auto;
    padding-top: 178px;
    ${fontStyleMixin({
      size: 27,
      weight: '300'
    })};
  }
`;

const ContentDiv = styled.div`
  width: 1125px;
  margin: auto;
  box-sizing: border-box;
  padding: 33px 112.5px 100px;
`;

const StyledShowCurrentTab = styled(ShowCurrentTab)`
  float: left;
  width: calc(900px - 680px);
  box-sizing: border-box;
`;

const Article = styled.article`
  float: right;
  width: 680px;
  box-sizing: border-box;
  margin-top: -4px;
`;

interface Props {
  title: string;
  items: ITabItem[];
  currentTab: TabIndex;
  children: React.ReactNode;
  showStep?: boolean;
  bannerBackground: string;
}
 
const BannerCard = React.memo<Props>(({
  title,
  items,
  currentTab,
  children,
  showStep = false,
  bannerBackground
}) => {
  const Header = React.useMemo(() => (
    <BannerImgDiv bannerBackground={bannerBackground}>
      <h2>{title}</h2>
    </BannerImgDiv>
  ), [title, bannerBackground]);

  return (
    <WaypointHeader headerComp={Header}>
      <ContentDiv className="clearfix">
        <StyledShowCurrentTab
          items={items}
          currentTab={currentTab}
          showStep={showStep}
        />
        <Article>{children}</Article>
      </ContentDiv>
    </WaypointHeader>
  );
});

export default BannerCard;
