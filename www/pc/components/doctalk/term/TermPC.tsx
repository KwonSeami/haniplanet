import * as React from 'react';
import styled from 'styled-components';
import CheckBox from '../../UI/Checkbox1/CheckBox';
import SelectBox from '../../inputs/SelectBox/SelectBoxDynamic';
import TitleCard from '../../UI/Card/TitleCard';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $TEXT_GRAY} from '../../../styles/variables.types';
import A from '../../UI/A';
import {staticUrl} from '../../../src/constants/env';
import DoctalkDisclosureInfo, {DISCLOSURE_INFO_VER} from '../../terms/DoctalkDisclosureInfo';

interface ITermAgreeProps {
  term1: boolean;
  term2: boolean;
  term3: boolean;
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
  padding: 14px 0 10px;
  ${fontStyleMixin({
    size: 19,
  })};
`;

const Li = styled.li`
  position: relative;
  padding-top: 15px;

  .check-box {
    display: inline-block;
    margin-right: 6px;

    label {
      font-size: 15px;
    }
  }

  a {
    span {
      text-decoration: underline;
      ${fontStyleMixin({
        size: 12,
        weight: 'bold',
        color: $TEXT_GRAY
      })};
    }

    img {
      width: 11px;
      vertical-align: middle;
    }
  }

  .select-box {
    position: absolute;
    right: 0;
    top: 8px;
    width: 150px;
  }
`;

const StyledDoctalkDisclosureInfo = styled(DoctalkDisclosureInfo)`
  width: 100%;
  padding: 10px 9px;

  .select-box {
    display: none;
  }

  dl {
    width: 100%;
  }

  h2 {
    margin-bottom: 14px;
    ${fontStyleMixin({
      size: 17,
      weight: 'bold'
    })};
  }
`;

const TermPC = React.memo<Props>(({className, termAgree, setTermAgree}) => {
  const {term1, term2, term3} = termAgree;
  const [disclosureInfoVer, setDisclosureInfoVer] = React.useState(null);

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
            닥톡 서비스 약관 동의
          </CheckBox>
          <A
            to="https://web.doctalk.co.kr/help/policy"
            newTab
          >
            <span>약관 보기</span>
            <img
              src={staticUrl('/static/images/icon/arrow/icon-arrow-gray.png')}
              alt="화살표"
            />
          </A>
        </Li>
        <Li>
          <CheckBox
            checked={term2}
            onChange={() => setTermAgree(curr => ({
              ...curr,
              term2: !curr.term2
            }))}
          >
            닥톡 개인정보 수집 및 이용 동의
          </CheckBox>
          <A
            to="https://web.doctalk.co.kr/help/privacy"
            newTab
          >
            <span>약관 보기</span>
            <img
              src={staticUrl('/static/images/icon/arrow/icon-arrow-gray.png')}
              alt="화살표"
            />
          </A>
        </Li>
        <Li>
          <SelectBox
            className="select-box"
            option={DISCLOSURE_INFO_VER}
            value={String(disclosureInfoVer)}
            onChange={version => setDisclosureInfoVer(version)}
          />
          <CheckBox
            checked={term3}
            onChange={() => setTermAgree(curr => ({
              ...curr,
              term3: !curr.term3
            }))}
          >
            개인정보 제 3자 제공에 대한 별도 동의
          </CheckBox>
          <Div>
            <StyledDoctalkDisclosureInfo
              defaultVersion={disclosureInfoVer}
              onChange={version => setDisclosureInfoVer(version)}
            />
          </Div>
        </Li>
      </ul>
    </TitleCard>
  );
});

TermPC.displayName = 'TermPC';
export default TermPC;
