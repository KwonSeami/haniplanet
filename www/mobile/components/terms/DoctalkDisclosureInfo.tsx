import * as React from 'react';
import PolicyDiv from './styles/PolicyDiv';
import PolicySelectBox from './styles/PolicySelectBox';
import Tabs from '../UI/tab/Tabs';
import usePrevious from '../../src/hooks/usePrevious';
import DoctalkDisclosure200131 from './doctalkDisclosureInfo/DoctalkDisclosure200131';

interface Props {
  className?: string;
  defaultVersion?: string;
  tab?: string;
  onChange?: (version: string) => void;
}

export const DISCLOSURE_INFO_VER = [
  {label: '2020-01-31', value: '1'},
];

const validDefaultVersion = (version: string | number) => {
  const defaultVersion = DISCLOSURE_INFO_VER[0].value;
  const versions = DISCLOSURE_INFO_VER.map(({value}) => Number(value));
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

const DoctalkDisclosureInfo = React.memo<Props>(({className, defaultVersion, onChange}) => {
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
        option={DISCLOSURE_INFO_VER}
        value={String(version)}
        onChange={version => setVersion(version)}
      />
      <h2>개인정보 제 3자 제공에 대한 별도 동의</h2>
      <Tabs currentTab={Number(version)}>
        <DoctalkDisclosure200131/>
      </Tabs>
    </PolicyDiv>
  );
});

DoctalkDisclosureInfo.displayName = 'DoctalkDisclosureInfo';
export default DoctalkDisclosureInfo;
