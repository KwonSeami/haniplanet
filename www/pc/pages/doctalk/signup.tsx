import React from 'react';
import Tabs, {useTabs} from '../../components/UI/tab/Tabs';
import BannerCard from '../../components/UI/Card/BannerCard';
import FormPC from '../../components/doctalk/currentComponent/form/FormPC';
import CompletePC from '../../components/doctalk/currentComponent/complete/CompletePC';
import AgreementPC from '../../components/doctalk/currentComponent/agreement/AgreementPC';
import useTabContent from '../../components/UI/tab/useTabContent';
import {staticUrl} from '../../src/constants/env';
import doctorRequired from '../../hocs/doctorRequired';
import loginRequired from '../../hocs/loginRequired';
import {useSelector, shallowEqual} from 'react-redux';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import Page400 from '../../components/errors/Page400';

const TAB_ITEMS = [
  {name: '회원선택/약관동의', index: 1},
  {name: '정보입력', index: 2},
  {name: '가입완료', index: 3}
];

interface CurrTabInfo {
  CurrComp: React.FunctionComponent<ICurrentComponentProps>;
  currentTab: number;
}

export type TDoctalkSignType = '' | 'hospital' | 'haniplanet';

export interface ICurrentComponentProps {
  signType: TDoctalkSignType;
  setSignType: React.Dispatch<React.SetStateAction<TDoctalkSignType>>;
  setCurrComp: React.Dispatch<React.SetStateAction<CurrTabInfo>>;
  next?: () => void;
}

const SignupPage = React.memo(() => {
  const {isDoctalkDoctor} = useSelector(
    ({orm, system: {session: {id}}}) => ({
      isDoctalkDoctor: (pickUserSelector(id)(orm) || {}).is_doctalk_doctor
    }),
    shallowEqual
  );

  if (isDoctalkDoctor) {
    return <Page400/>
  }

  const [signType, setSignType] = React.useState<TDoctalkSignType>('');

  const {currentTab, next} = useTabs();
  const convertTabContent = useTabContent({next, signType, setSignType});

  return (
    <BannerCard
      title="한의플래닛 X 닥톡 - NAVER 지식iN 한의사 전문가 가입"
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
export default loginRequired(doctorRequired(SignupPage));
