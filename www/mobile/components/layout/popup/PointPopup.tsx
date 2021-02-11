import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {PopupProps} from '../../common/popup/base/Popup';
import Confirm, {StyledButtonGroup} from '../../common/popup/Confirm';
import Button from '../../inputs/Button';
import Input from '../../inputs/Input';
import PointCompletePopup from './PointCompletePopup';
import StoryApi from '../../../src/apis/StoryApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {RootState} from '../../../src/reducers';
import {staticUrl} from '../../../src/constants/env';
import {pushPopup} from '../../../src/reducers/popup';
import {numberWithCommas} from '../../../src/lib/numbers';
import {fontStyleMixin, radiusMixin} from '../../../styles/mixins.styles';
import {updateUser} from '../../../src/reducers/orm/user/userReducer';
import {updateStory} from '../../../src/reducers/orm/story/storyReducer';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {TitleDiv, Close} from '../../common/popup/base/TitlePopup';
import {$FONT_COLOR, $BORDER_COLOR, $POINT_BLUE, $GRAY, $WHITE} from '../../../styles/variables.types';
import {HashId} from '../../../../../packages/types';
import PointChargePopup from './PointChargePopup';
import Radio from '../../UI/Radio/Radio';
import {POINT_EXPOSE_TYPES, POINT_OPEN_RANGES} from '@hanii/planet-point';

const StyledConfirm = styled(Confirm)`
  .modal-body {
    width: 330px;

    ${TitleDiv} {
      padding: 28px 0 9px;
      text-align: center;
      border: 0;

      h2 {
        ${fontStyleMixin({
          size: 21,
          weight: '300'
        })};
      }
    } 

    ${Close} {
      right: 13px;
      top: 13px
    }
  }

  ${StyledButtonGroup} {
    padding: 30px 0;
  }
`;

const SendPointDiv = styled.div`
  .notice {
    padding-bottom: 26px;
    text-align: center;
    ${fontStyleMixin({
      size: 14,
      color: $GRAY
    })};
  }

  .payment-box {
    position: relative;
    padding: 0 18px;

    h3 {
      position: absolute;
      left: 20px;
      top: 13px;
      ${fontStyleMixin({
        size: 12,
        weight: 'bold'
      })};
    }

    p {
      display: inline-block;
      vertical-align: middle;
      width: calc(100% - 110px);
      margin-right: 10px;
      padding: 6px 2px 4px 65px;
      box-sizing: border-box;
      border-bottom: 1px solid ${$FONT_COLOR};
      text-align: right;
      ${fontStyleMixin({
        size: 24,
        weight: '300',
        color: $POINT_BLUE,
        family: 'Montserrat'
      })};

      img {
        width: 15px;
        display: inline-block;
        vertical-align: middle;
        margin: -4px 3px 0 0;
      }
    }
  }

  .charge-box {
    position: relative;
    margin-top: 10px;
    padding-right: 25px;
    height: 40px;
    background-color: ${$WHITE};
    border: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;

    span {
      position: absolute;
      top: 8px;
      right: 15px;
      font-size: 14px;
    }
    
    &.active {
      background-color: #f9f9f9;
    }
  }

  .error {
    display: block;
    margin-bottom: -9px;
    padding-top: 3px;
    ${fontStyleMixin({
      size: 11,
      color: '#f32b43'
    })};
  }

  .set-visibility-box {
    position: relative;
    margin-top: 5px;

    h3 {
      position: absolute;
      left: 18px;
      top: 13px;
      ${fontStyleMixin({
        size: 12,
        weight: 'bold'
      })};
    }

    .visibility-btn-box {
      position: relative;
      padding-top: 35px;
      margin: 0 18px;
      .visibility-btn {
        margin-right: 4px;
        ${radiusMixin('5px', $BORDER_COLOR)};
        
        h2 {
          padding: 10px 12px;
          ${fontStyleMixin({
            size: 14,
            color: $GRAY
          })};
        }

        &.on {
          border: 1px solid ${$POINT_BLUE};
          background-color: ${$POINT_BLUE};

          h2 {
            ${fontStyleMixin({
              color: $WHITE
            })};
          }
        }
      }
    }
  }

  .select-name {
    margin: 22px 18px 0;

    .radio {
      display: inline-block;

      & ~ .radio {
        margin-left: 20px;
      }

      label {
        color: ${$FONT_COLOR};
        padding-left: 25px;
        margin-top: -2px;
      }
    }
  }
`;

const ChargeButton = styled(Button)`
  display: inline-block;
  vertical-align: middle;

  &:hover {
    border-color: ${$GRAY};
  }
`;

const ChargeInput = styled(Input)`
  width: 100%;
  height: 37px;
  padding: 0 10px 0 12px;
  ${fontStyleMixin({
    size: 22,
    family: 'Montserrat'
  })};

  &::placeholder {
    font-size: 14px;
    padding-bottom: 6px;
    line-height: 34px;
  }
`;

interface Props extends PopupProps {
  storyPk: HashId;
}

const PointPopup = React.memo<Props>(
  ({id, closePop, storyPk}) => {
    // State
    const [amount, setAmount] = React.useState('');
    const [isAmountErr, setIsAmountErr] = React.useState('');
    const [openRangeErr, setOpenRangeErr] = React.useState('');
    const [openRange, setOpenRange] = React.useState('');
    const [exposeType, setExposeType] = React.useState(POINT_EXPOSE_TYPES[0].value);

    // Redux
    const dispatch = useDispatch();
    const me = useSelector(
      ({system: {session: {id}}, orm}: RootState) =>
        pickUserSelector(id)(orm) || {} as any,
      shallowEqual,
    );
    const {point} = me || {} as any;

    const storyApi: StoryApi = useCallAccessFunc(access => new StoryApi(access));

    return (
      <StyledConfirm
        notClosePop
        id={id}
        closePop={closePop}
        title="별 보내기"
        buttonGroupProps={{
          leftButton: {
            onClick: () => closePop(id)
          },
          rightButton: {
            onClick: () => {
              if (!amount) {
                setIsAmountErr('별 개수를 입력해주세요.');
                return null;
              } else if (!Number(amount)) {
                setIsAmountErr('1개 이상의 별을 입력해주세요.');
                return null;
              } else if (Number(amount) > point) {
                setIsAmountErr('보유하신 별이 부족합니다. 충전해주세요.');
                return null;
              } else {
                setIsAmountErr('');
              }

              if (openRange === '') {
                setOpenRangeErr('공개범위를 선택해주세요.');
                return null;
              } else {
                setOpenRangeErr('');
              }

              confirm(`${numberWithCommas(Number(amount))}개의 별을 보내시겠습니까?`) && (
                storyApi.spendPoint(storyPk, {
                  amount,
                  user_expose_type: openRange === 'only_me'
                    ? 'real'
                    : exposeType,
                  open_range: openRange
                }).then(({status}) => {
                  if (status === 201) {
                    const numAmount = Number(amount);

                    closePop(id);
                    dispatch(pushPopup(PointCompletePopup, {type: 'SEND', point: numAmount}));
                    dispatch(updateUser(me.id, curr => ({
                      ...curr, 
                      point: curr.point - numAmount
                    })));
                    dispatch(updateStory(storyPk, curr => ({
                      ...curr,
                      received_point: curr.received_point + numAmount
                    })));
                  }
                })
              );
            }
          }
        }}
      >
        <SendPointDiv>
          <p className="notice">
            해당 글에 별을 보내시겠어요?<br />
            보내실 별 개수를 입력해주세요.
          </p>
          <div className="payment-box">
            <h3>현재 나의 별</h3>
            <p>
              <img
                src={staticUrl("/static/images/icon/icon-point.png")}
                alt="현재 나의 별"
              />
              {numberWithCommas(point)}
            </p>
            <ChargeButton
              onClick={() => {
                dispatch(pushPopup(PointChargePopup));
              }}
              size={{width: '100px', height: '40px'}}
              font={{size: '15px', color: $POINT_BLUE}}
              border={{radius: '0', width: '1px', color: $BORDER_COLOR}}
            >
              충전하기
            </ChargeButton>
            <div className={cn('charge-box', {active: !!amount})}>
              <ChargeInput
                numberOnly
                placeholder="1개 이상의 별을 입력해주세요."
                value={amount}
                onChange={({target: {value}}) => setAmount((value))}
              />
              <span>개</span>
            </div>
            {isAmountErr && (
              <span className="error">{isAmountErr}</span>
            )}
          </div>
          <div className="set-visibility-box">
            <h3>보낸 별을 어느 범위까지 공개할까요?</h3>
            <div className="visibility-btn-box">
              {POINT_OPEN_RANGES.map(({label, value}) => (
                <Button
                  key={value}
                  className={cn("visibility-btn", {
                    on: value === openRange
                  })}
                  onClick={() => {setOpenRange(value)}}
                >
                  <h2>
                    {label}
                  </h2>
                </Button>
              ))}
              {openRangeErr && (
                <span className="error">{openRangeErr}</span>
              )}
            </div>
          </div>
          {openRange !== 'only_me' && (
            <div className="select-name">
              {POINT_EXPOSE_TYPES.map(({label, value}) => (
                <Radio
                  key={value}
                  checked={exposeType === value}
                  onClick={() => setExposeType(value)}
                >
                  {label}
                </Radio>
              ))}
            </div>
          )}
        </SendPointDiv>
      </StyledConfirm>
    );
  }
);

PointPopup.displayName = 'PointPopup';
export default PointPopup;
