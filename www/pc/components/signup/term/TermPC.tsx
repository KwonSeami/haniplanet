import * as React from 'react';
import styled from 'styled-components';
import CheckBox from '../../../components/UI/Checkbox1/CheckBox';
import SelectBox from '../../inputs/SelectBox/SelectBoxDynamic';
import TitleCard from '../../../components/UI/Card/TitleCard';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR} from '../../../styles/variables.types';
import Terms from '../../../components/terms/Terms';
import PrivacyPolicy, {PRIVACY_POLICY_VER} from '../../../components/terms/PrivacyPolicy';

interface ITermAgreeProps {
  term1: boolean;
  term2: boolean;
}

interface Props {
  className?: string;
  termAgree: ITermAgreeProps;
  setTermAgree: React.Dispatch<React.SetStateAction<ITermAgreeProps>>;
}

export const Div = styled.div`
  border: 1px solid ${$BORDER_COLOR};
  padding: 10px;
  height: 186px;
  box-sizing: border-box;
  border-radius: 2px;
  margin-top: 19px;
  overflow-y: auto;
`;

export const H2 = styled.h2`
  padding: 14px 0 5px;
  ${fontStyleMixin({
    size: 19,
    weight: '300'
  })}
`;

const Li = styled.li`
  position: relative;
  padding-top: 23px;

  .select-box {
    position: absolute;
    right: 0;
    top: 8px;
    width: 150px;
  }
`;

const StyledTerms = styled(Terms)`
  width: 100%;
  padding: 20px;
`;

const StyledPrivacyPolicy = styled(PrivacyPolicy)`
  width: 100%;
  padding-top: 20px;

  .select-box {
    display: none;
  }

  dl {
    width: 100%;
  }
`;

const TermPC = React.memo<Props>(({className, termAgree, setTermAgree}) => {
  const {term1, term2} = termAgree;
  const [privacyVer, setPrivacyVer] = React.useState(null);

  return (
    <TitleCard
      className={className}
      title={ <H2>약관 동의</H2> }
    >
      <ul>
        <Li>
          <CheckBox
            checked={term1}
            onChange={() => setTermAgree(curr => ({
              ...curr,
              term1: !curr.term1
            }))}
          >
            이용약관 동의
          </CheckBox>
          <Div>
            <StyledTerms />
          </Div>
        </Li>
        <Li>
          <SelectBox
            className="select-box"
            option={PRIVACY_POLICY_VER}
            value={String(privacyVer)}
            onChange={version => setPrivacyVer(version)}
          />
          <CheckBox
            checked={term2}
            onChange={() => setTermAgree(curr => ({
              ...curr,
              term2: !curr.term2
            }))}
          >
            개인정보 처리방침 동의
          </CheckBox>
          <Div>
            <StyledPrivacyPolicy
              defaultVersion={privacyVer}
              onChange={version => setPrivacyVer(version)}
            />
          </Div>
        </Li>
      </ul>
    </TitleCard>
  );
});

TermPC.displayName = 'TermPC';
export default TermPC;
