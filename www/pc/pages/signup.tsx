import * as React from 'react';
import Tabs, {useTabs} from '../components/UI/tab/Tabs';
import BannerCard from '../components/UI/Card/BannerCard';
import FormPC from '../components/signup/currentComponent/form/FormPC';
import CompletePC from '../components/signup/currentComponent/complete/CompletePC';
import AgreementPC from '../components/signup/currentComponent/agreement/AgreementPC';
import anonRequired from '../hocs/anonRequired';
import useTabContent from '../components/UI/tab/useTabContent';
import {staticUrl} from '../src/constants/env';

const TAB_ITEMS = [
  {name: "회원선택/약관동의", index: 1},
  {name: "정보입력", index: 2},
  {name: "가입완료", index: 3}
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
    <BannerCard
      title="회원가입"
      items={TAB_ITEMS}
      currentTab={currentTab}
      showStep
      bannerBackground={staticUrl('/static/images/banner/img-signup.png')}
    >
      <Tabs currentTab={currentTab}>
        {convertTabContent(AgreementPC)}
        {convertTabContent(FormPC)}
        {convertTabContent(CompletePC)}
      </Tabs>
    </BannerCard>
  );
});

SignupPage.displayName = 'SignupPage';
export default anonRequired(SignupPage);
