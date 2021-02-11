import * as React from 'react';
import styled from 'styled-components';
import Radio, {Span} from '../../../../../components/UI/Radio/Radio';
import VerticalTitleCard from '../../../../../components/UI/Card/VerticalTitleCard';
import {heightMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR} from '../../../../../styles/variables.types';

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

interface InputProps {
  telephone?: boolean;
}

const Input = styled.input<InputProps>`
  width: 100%;
  ${heightMixin(44)}
  box-sizing: border-box;
  font-size: 13px;  
  border-bottom: 1px solid ${$BORDER_COLOR} !important;

  ${props => props.telephone && `
    background-color: #f6f7f9;
  `}
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
  setJoinPathText: React.Dispatch<React.SetStateAction<string>>;
  requiredInputError: boolean;
}

const SubscrPathPC: React.FC<Props> = React.memo(({setJoinPathText, requiredInputError}) => {
  const [joinPath, setJoinPath] = React.useState('');
  const [directJoinPath, setDirectJoinPath] = React.useState('');
  const memoSetJoinPath = item => React.useCallback(() => setJoinPath(item), []);
  const memoSetDirectJoinPath = React.useCallback(({target: {value}}) => setDirectJoinPath(value), []);

  React.useEffect(() => {
    if (joinPath === DIRECT_JOIN_PATH) {
      setJoinPathText(directJoinPath);
    } else {
      const [selectedItem] = JOIN_PATH_ROUTES.filter(item => item === joinPath);
      setJoinPathText(selectedItem);
    }
  }, [joinPath, directJoinPath]);

  return (
    <StyledVerticalTitleCard
      title="가입경로"
      errormsg={(requiredInputError && !joinPath) && "가입 경로를 체크해주세요."}
    >
      <ul>
        {JOIN_PATH_ROUTES.map(item => (
          <RouteLi key={item}>
            <Radio
              checked={joinPath === item}
              onClick={memoSetJoinPath(item)}
            >
              {item}
            </Radio>
          </RouteLi>
        ))}
        <RouteLi>
          <Radio
            checked={joinPath === DIRECT_JOIN_PATH}
            onClick={memoSetJoinPath(DIRECT_JOIN_PATH)}
          >
            <Input
              type="text"
              placeholder="직접입력"
              value={directJoinPath}
              maxLength={30}
              onChange={memoSetDirectJoinPath}
            />
          </Radio>
        </RouteLi>
      </ul>
    </StyledVerticalTitleCard>
  );
});

export default SubscrPathPC;
