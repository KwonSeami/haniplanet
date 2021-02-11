import * as React from 'react';
import styled from 'styled-components';
import ShowCurrentTab from '../../components/UI/ShowCurrentTab';
import {backgroundImgMixin} from '../../styles/mixins.styles';
import useTabContent from '../../components/UI/tab/useTabContent';
import Tabs, {useTabs} from '../../components/UI/tab/Tabs';
import AgreementMobile from '../../components/doctalk/currentComponent/agreement/AgreementMobile';
import FormMobile from '../../components/doctalk/currentComponent/form/FormMobile';
import CompleteMobile from '../../components/doctalk/currentComponent/complete/CompleteMobile';
import {useSelector, shallowEqual} from 'react-redux';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {RootState} from '../../src/reducers';
import Page400 from '../../components/errors/Page400';
import loginRequired from '../../hocs/loginRequired';
import doctorRequired from '../../hocs/doctorRequired';

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
`;

const TAB_ITEMS = [
  {name: '회원선택/약관동의', index: 1},
  {name: '정보입력', index: 2},
  {name: '가입완료', index: 3},
];

export type TDoctalkSignType = '' | 'hospital' | 'haniplanet';

export interface ICurrentComponentProps {
  signType: TDoctalkSignType;
  setSignType: React.Dispatch<React.SetStateAction<TDoctalkSignType>>;
  setCurrComp: React.Dispatch<React.SetStateAction<CurrTabInfo>>;
  next?: () => void;
}

interface CurrTabInfo {
  CurrComp: React.FunctionComponent<ICurrentComponentProps>;
  currentTab: number;
}

const SignupPage = React.memo(() => {
  const {isDoctalkDoctor} = useSelector(
    ({orm, system: {session: {id}}}: RootState) => ({
      isDoctalkDoctor: (pickUserSelector(id)(orm) || {}).is_doctalk_doctor
    }),
    shallowEqual
  );

  if (isDoctalkDoctor) {
    return <Page400/>;
  }

  const [signType, setSignType] = React.useState<TDoctalkSignType>('');
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
export default loginRequired(doctorRequired(SignupPage));
