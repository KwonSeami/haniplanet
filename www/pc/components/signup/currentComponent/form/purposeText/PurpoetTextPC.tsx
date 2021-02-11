import * as React from 'react';
import styled from 'styled-components';
import xor from 'lodash/xor';
import CheckBox from '../../../../../components/UI/Checkbox1/CheckBox';
import VerticalTitleCard from '../../../../../components/UI/Card/VerticalTitleCard';
import {TSignupForm} from '../FormPC';

const StyledVerticalTitleCard = styled(VerticalTitleCard)`
  padding: 15px 0 9px 151px;

  ul {
    padding-top: 6px;
  }
`;

const RouteLi = styled.li`
  display: inline-block;
  vertical-align: middle;
  padding: 0 31px 23px 0;
`;

const StyledCheckBox = styled(CheckBox)`
  label {
    padding-left: 23px;

    &::before {
      width: 15px;
      height: 15px;
      left: -1px;
      top: 1px;
    }
  }
`;

const PURPOSE_TEXTS = [
  '한의원검색',
  '처방사전 검색',
  '커뮤니티 이용',
  '세미나/모임 이용 및 개설',
  '소모임 서비스(MOA) 이용',
];

interface Props {
  form: TSignupForm['purpose'];
  dispatchSignupForm: React.Dispatch<any>;
}

const PurpoetTextPC = React.memo<Props>(({form, dispatchSignupForm}) => {
  const {purposeList, error: {purposeErr}} = form;

  const handleOnChangePurposePathData = React.useCallback(value => () => {
    dispatchSignupForm({type: 'KEY_OBJ_TOGGLE_FIELD', key: 'purpose', name: 'purposeList', value});
  }, []);

  const isAllItemChk = React.useMemo(() => purposeList.length === PURPOSE_TEXTS.length, [purposeList]);

  React.useEffect(() => {
    dispatchSignupForm({
      type: 'KEY_FIELD',
      key: 'purpose',
      name: 'purpose',
      value: isAllItemChk ? ['모든 서비스 이용'] :  purposeList,
    });
  }, [isAllItemChk, purposeList]);

  return (
    <StyledVerticalTitleCard
      title={<>서비스<br />이용목적</>}
      errormsg={!!purposeErr && purposeErr}
    >
      <ul>
        {PURPOSE_TEXTS.map(item => (
          <RouteLi key={item}>
            <StyledCheckBox
              checked={purposeList.includes(item)}
              onChange={handleOnChangePurposePathData([item])}
            >
              {item}
            </StyledCheckBox>
          </RouteLi>
        ))}
        <RouteLi>
          <CheckBox
            checked={isAllItemChk}
            onChange={() => {
              dispatchSignupForm({
                type: 'KEY_FIELD',
                key: 'purpose',
                name: 'purposeList',
                value: isAllItemChk ? [] : PURPOSE_TEXTS,
              });
            }}
          >
            모든 서비스 이용
          </CheckBox>
        </RouteLi>
      </ul>
    </StyledVerticalTitleCard>
  );
});

export default PurpoetTextPC;
