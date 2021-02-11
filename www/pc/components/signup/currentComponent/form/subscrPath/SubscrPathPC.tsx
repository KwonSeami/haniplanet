import * as React from 'react';
import styled from 'styled-components';
import Radio, {Span} from '../../../../../components/UI/Radio/Radio';
import VerticalTitleCard from '../../../../../components/UI/Card/VerticalTitleCard';
import {heightMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR} from '../../../../../styles/variables.types';
import {TSignupForm} from '../FormPC';

const StyledVerticalTitleCard = styled(VerticalTitleCard)`
  padding: 15px 0 30px 151px;
`;

const RouteLi = styled.li`
  display: inline-block;
  vertical-align: middle;
  padding: 7px 22px 0 0;

  &:nth-child(4) {
    padding-right: 0;
  }

  &:last-child {
    padding-right: 0;

    ${Span} {
      top: 12px !important;
    }
  }

  input {
    width: 305px;
  }
`;

const Input = styled.input`
  width: 100%;
  font-size: 13px;
  box-sizing: border-box;
  border-bottom: 1px solid ${$BORDER_COLOR} !important;
  ${heightMixin(44)};
`;

const DIRECT_JOIN_PATH = '직접 입력';

const JOIN_PATH_ROUTES = [
  '검색포털 사이트',
  '지인추천',
  'SNS',
  '세미나, 모임',
  '한의학 커뮤니티'
];

interface Props {
  form: TSignupForm['subscrPath'];
  dispatchSignupForm: React.Dispatch<any>;
}

const SubscrPathPC = React.memo<Props>(({form, dispatchSignupForm}) => {
  const {joinPath, directJoinPath, error: {joinPathErr}} = form;

  const handleOnChangeSubscrPathData = React.useCallback((name, value) => {
    dispatchSignupForm({type: 'KEY_FIELD', key: 'subscrPath', name, value});
  }, []);

  React.useEffect(() => {
    handleOnChangeSubscrPathData(
      'join_path_text',
      joinPath === DIRECT_JOIN_PATH ? directJoinPath : joinPath
    );
  }, [handleOnChangeSubscrPathData, joinPath, directJoinPath]);

  return (
    <StyledVerticalTitleCard
      title="가입경로"
      errormsg={!!joinPathErr && joinPathErr}
    >
      <ul>
        {JOIN_PATH_ROUTES.map(item => (
          <RouteLi key={item}>
            <Radio
              name={item}
              checked={joinPath === item}
              onClick={() => handleOnChangeSubscrPathData('joinPath', item)}
            >
              {item}
            </Radio>
          </RouteLi>
        ))}
        <RouteLi>
          <Radio
            checked={joinPath === DIRECT_JOIN_PATH}
            onClick={() => handleOnChangeSubscrPathData('joinPath', DIRECT_JOIN_PATH)}
          >
            <Input
              type="text"
              placeholder="직접입력"
              maxLength={30}
              name="directJoinPath"
              onBlur={({target: {name, value}}) => handleOnChangeSubscrPathData(name, value)}
            />
          </Radio>
        </RouteLi>
      </ul>
    </StyledVerticalTitleCard>
  );
});

SubscrPathPC.displayName = 'SubscrPathPC';
export default SubscrPathPC;
