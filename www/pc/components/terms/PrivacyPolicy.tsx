import * as React from 'react';
import PolicyDiv from './styles/PolicyDiv';
import PolicySelectBox from './styles/PolicySelectBox';
import Policy181217 from './privacyPolicy/Policy181217';
import Policy180705 from './privacyPolicy/Policy180705';
import Policy170901 from './privacyPolicy/Policy170901';
import Policy190907 from './privacyPolicy/Policy190907';
import Policy200507 from './privacyPolicy/Policy200507';
import Policy200515 from './privacyPolicy/Policy200515';
import Tabs from '../UI/tab/Tabs';
import usePrevious from '../../src/hooks/usePrevious';

interface Props {
  className?: string;
  defaultVersion?: string;
  tab?: string;
  onChange?: (version: string) => void;
}

export const PRIVACY_POLICY_VER = [
  {label: '2020-05-15', value: '1'},
  {label: '2020-05-07', value: '2'},
  {label: '2019-09-07', value: '3'},
  {label: '2018-12-17', value: '4'},
  {label: '2018-07-05', value: '5'},
  {label: '2017-09-01', value: '6'},
];

const validDefaultVersion = (version: string | number) => {
  const defaultVersion = PRIVACY_POLICY_VER[0].value;
  const versions = PRIVACY_POLICY_VER.map(({value}) => Number(value));
  const NumVer = Number(version);
  
  if (!['string', 'number'].includes(typeof version)) {
    return defaultVersion;
  } else if (isNaN(NumVer)) {
    return defaultVersion;
  } else if (!versions.includes(NumVer)) {
    return defaultVersion;
  }

  return version;
};

const PrivacyPolicy = React.memo<Props>(({className, defaultVersion, onChange}) => {
  const [version, setVersion] = React.useState(validDefaultVersion(defaultVersion));
  const prevVersion = usePrevious(version);

  // defaultVersion이 변경되면 version에 값을 저장합니다.
  // version이 변경되면 onChange 함수를 사용해 값을 반환합니다.
  // onChange를 사용해 defaultVersion의 값을 바꾸면 두 값이 chain 됩니다.
  React.useEffect(() => {
    if (!!defaultVersion) {
      setVersion(defaultVersion);
    }
  }, [defaultVersion]);

  React.useEffect(() => {
    if (prevVersion !== version) {
      onChange && onChange(String(version));
    }
  }, [version, onChange]);

  return (
    <PolicyDiv className={className}>
      <PolicySelectBox
        option={PRIVACY_POLICY_VER}
        value={String(version)}
        onChange={version => setVersion(version)}
      />
      <h2>개인정보처리방침</h2>
      <p className="policy-top-text">
        한의플래닛의 개인정보보호정책은 관계법령 규정을 반영하여 다음과 같은 내용을 담고 있습니다.<br />
        <br />
        (주)버키(이하 ‘회사’라 한다)는 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와
        관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리지침을 수립,
        공개합니다.
      </p>
      <Tabs currentTab={Number(version)}>
        <Policy200515 />
        <Policy200507 />
        <Policy190907 />
        <Policy181217 />
        <Policy180705 />
        <Policy170901 />
      </Tabs>
    </PolicyDiv>
  );
});

PrivacyPolicy.displayName = 'PrivacyPolicy';
export default PrivacyPolicy;
