import * as React from 'react';
import styled from 'styled-components';
import cloneDeep from 'lodash/cloneDeep';
import ButtonGroup from '../inputs/ButtonGroup';
import CheckBox from '../UI/Checkbox1/CheckBox';
import MeetupApi from '../../src/apis/MeetupApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import {Div, Responsiveli, SeminarBanner} from './pcStyledComp';
import {callOrPrice} from '../../src/lib/numbers';
import {TOptionState} from '../../src/@types/IMeetUp';
import {fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {$POINT_BLUE, $GRAY, $BORDER_COLOR, $THIN_GRAY} from '../../styles/variables.types';
import Loading from '../common/Loading';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import xor from 'lodash/xor';
import {MEETUP_OPTIONS} from "../../src/constants/meetup";
import {array, number, object} from 'yup';

const Tab3ResponsiveUl = styled.ul`
  margin: -15px 0;

  li {
    position: relative;
    padding: 15px 0;

    & + li {
      border-top: 1px solid ${$BORDER_COLOR};
    }
    
    .option-p {
      padding-top: 3px;
      padding-left: 25px;
      ${fontStyleMixin({
        size: 12,
        color: $GRAY,
      })};
    }

    .option-price-span {
      position: absolute;
      top: 15px;
      right: 0;
      ${fontStyleMixin({
        size: 15,
        color: $POINT_BLUE,
      })};
    }
  }
`;

const StyledButtonGroup = styled(ButtonGroup)`
  padding: 30px 0 50px;
  text-align: right;

  li {
    padding: 0 5px;

    &:last-child {
      padding-right: 0;
    }
  }

  button {
    width: 138px;
    ${heightMixin(39)};
    border-radius: 19.5px;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid ${$THIN_GRAY};
    ${fontStyleMixin({
      size: 15,
      color: '#999'
    })};

    &.right-button {
      border-color: ${$POINT_BLUE};
      color: ${$POINT_BLUE};
    }
  }
`;

const OptionCheckBox = styled(CheckBox)`
  padding: 0;

  label {
    font-size: 15px;

    &::before {
      top: 3px;
    }
  }
`;

interface Props {
  className: string;
  next: () => void;
  optionState: TOptionState;
  options: Id[];
  prev: () => void;
}

const MeetupOptionTabPC = React.memo<Props>(({
  className,
  next,
  optionState,
  options,
  prev,
}) => {
  const [{itemById, items}, setOption] = optionState;

  const methods = useFormContext();
  const {getValues, setValue, watch} = methods;

  const _options = watch('options');

  // Api Call
  const meetupApi: MeetupApi = useCallAccessFunc(access => new MeetupApi(access));

  // 데이터의 형식이 올바른지 확인
  const isValidOptionForm = object().shape({
    options: array().of(number()).test(
      'essentialOptionContainment',
      'SMS 발송 옵션은 필수값 입니다.',
      value => value.includes(MEETUP_OPTIONS.send_sms)
    )
  });

  // Life Cycle
  React.useEffect(() => {
    meetupApi.option()
      .then(({data: {results}}) => !!results && setOption(curr => {
        const itemById = cloneDeep(curr.itemById);
        const items = [];

        results.forEach(item => {
          itemById[item.id] = item;
          items.push(item.id);
        });

        return { ...curr, itemById, items };
      }));
  }, []);

  if (!itemById) {
    return <Loading/>;
  }

  return (
    <>
      <SeminarBanner>
        <h2>세미나/모임모집 옵션정보</h2>
      </SeminarBanner>
      <Div className={className}>
        <ul>
          <Responsiveli>
            <h3>옵션정보</h3>
            <div>
              <Tab3ResponsiveUl>
                {items.map(item => {
                  const {id, is_call, name, price, text} = itemById[item];
                  const isChecked = _options.includes(id);

                  return (
                    <li key={`meetup-option-${id}`}>
                      <OptionCheckBox
                        checked={isChecked}
                        onChange={() => setValue('options', xor([id], getValues().options))}
                      >
                        {name}
                      </OptionCheckBox>
                      <p className="option-p">{text}</p>
                      <span className="option-price-span">{callOrPrice(is_call, price, '월')}</span>
                    </li>
                  );
                })}
              </Tab3ResponsiveUl>
            </div>
          </Responsiveli>
        </ul>
        <StyledButtonGroup
          leftButton={{
            children: '이전',
            onClick: () => prev()
          }}
          rightButton={{
            children: '다음',
            type: 'button',
            onClick: () => isValidOptionForm.validate(getValues())
              .then(() => next())
              .catch(({errors}) => alert(errors[0]))
          }}
        />
      </Div>
    </>
  );
});

MeetupOptionTabPC.displayName = 'MeetupOptionTabPC';
export default MeetupOptionTabPC;
