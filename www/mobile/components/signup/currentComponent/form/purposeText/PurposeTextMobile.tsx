import * as React from 'react';
import styled from 'styled-components';
import CheckBox from '../../../../../components/UI/Checkbox1/CheckBox';
import VerticalTitleCardMobile from '../../../../../components/UI/Card/VerticalTitleCardMobile';
import {TSignupForm} from '../FormMobile';

const StyledVerticalTitleCardMobile = styled(VerticalTitleCardMobile)`
  @media screen and (max-width: 500px) {
    padding-bottom: 30px;
  }
`;

const RouteLi = styled.li`
  display: inline-block;
  vertical-align: middle;
  padding: 15px 30px 0 0;
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

const PurposeTextMobile = React.memo<Props>(({form, dispatchSignupForm}) => {
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
    <StyledVerticalTitleCardMobile
      title="서비스 이용 목적"
      errormsg={!!purposeErr && purposeErr}
    >
      <ul>
        {PURPOSE_TEXTS.map(item => (
          <RouteLi key={item}>
            <CheckBox
              checked={purposeList.includes(item)}
              onChange={handleOnChangePurposePathData([item])}
            >
              {item}
            </CheckBox>
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
    </StyledVerticalTitleCardMobile>
  );
});

export default PurposeTextMobile;
