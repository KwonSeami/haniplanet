import * as React from 'react';
import styled from 'styled-components';
import Tabs, {useTabs} from '../components/UI/tab/Tabs';
import ShowCurrentTab from '../components/UI/ShowCurrentTab';
import FormMobile from '../components/signup/currentComponent/form/FormMobile';
import CompleteMobile from '../components/signup/currentComponent/complete/CompleteMobile';
import AgreementMobile from '../components/signup/currentComponent/agreement/AgreementMobile';
import anonRequired from '../hocs/anonRequired';
import useTabContent from '../components/UI/tab/useTabContent';
import {backgroundImgMixin} from '../styles/mixins.styles';

const BannerDiv = styled.div`
  width: 100%;
  min-height: 165px;
  background-color: #f4f4f4;
  padding-top: 26px;
  box-sizing: border-box;
  ${backgroundImgMixin({
    img: '/static/images/banner/img-banner.png',
    size: '360px',
    position: 'calc(50% - -159px) 100%',
  })};

  @media screen and (max-width: 680px) {
    padding: 23px 15px 0;
    background-position: 100%;
  }
`;

const StyledShowCurrentTab = styled(ShowCurrentTab)`
  max-width: 680px;
  margin: auto;

  li.on p {
    font-size: 23px;
  }

  p {
    font-size: 13px;
  }
`;

const Article = styled.article`
  max-width: 680px;
  margin: auto;
  overflow: hidden;
`;

const TAB_ITEMS = [
  {name: '회원선택/약관동의', index: 1},
  {name: '정보입력', index: 2},
  {name: '가입완료', index: 3},
];

interface CurrTabInfo {
  CurrComp: React.FunctionComponent<ICurrentCompoentProps>;
  currentTab: number;
}

export type SignType = '' | 'doctor' | 'student';

export interface ICurrentCompoentProps {
  signType: SignType;
  setSignType: React.Dispatch<React.SetStateAction<SignType>>;
  setCurrComp: React.Dispatch<React.SetStateAction<CurrTabInfo>>;
}

const SignupPage = React.memo(() => {
  const [signType, setSignType] = React.useState<SignType>('');
  const {currentTab, next} = useTabs();
  const convertTabContent = useTabContent({next, signType, setSignType});

  return (
    <div>
      <BannerDiv>
        <StyledShowCurrentTab
          items={TAB_ITEMS}
          currentTab={currentTab}
          showStep
        />
      </BannerDiv>
      <Article>
        <Tabs currentTab={currentTab}>
          {convertTabContent(AgreementMobile)}
          {convertTabContent(FormMobile)}
          {convertTabContent(CompleteMobile)}
        </Tabs>
      </Article>
    </div>
  );
});

SignupPage.displayName = 'SignupPage';
export default anonRequired(SignupPage);

