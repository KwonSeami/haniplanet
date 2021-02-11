import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import ButtonGroup from '../inputs/ButtonGroup';
import CheckBox from '../UI/Checkbox1/CheckBox';
import PaymentAgreement from './PaymentAgreement';
import {Div, Responsiveli, SeminarBanner} from './pcStyledComp';
import {$POINT_BLUE, $GRAY, $BORDER_COLOR, $FONT_COLOR, $THIN_GRAY} from '../../styles/variables.types';
import {callOrPrice} from '../../src/lib/numbers';
import {heightMixin, fontStyleMixin} from '../../styles/mixins.styles';
import {useFormContext} from "react-hook-form/dist/react-hook-form.ie11";
import {TOptionState} from '../../src/@types/IMeetUp';

const PriceTable = styled.table`
  width: 100%;
  border-top: 2px solid ${$GRAY};

  th, td {
    font-size: 13px;
    color: ${$FONT_COLOR};
    vertical-align: middle;
    font-weight: 400;
    text-align: left;
    padding: 10px 15px;
    border-bottom: 1px solid ${$BORDER_COLOR};
  }

  th {
    background-color: #f6f7f9;
    vertical-align: top;
    width: 120px;
    box-sizing: border-box;
  }

  td {
    padding: 10px 20px;
    font-size: 15px;

    li {
      width: 100%;
      box-sizing: border-box;
      position: relative;
      word-break: break-all;
      padding-right: 50px;

      span {
        font-size: 13px;
        position: absolute;
        top: 0;
        right: 0;
      }
    }

    > span {
      position: relative;
      display: inline-block;
      line-height: 18px;
      margin-left: 15px;
      ${fontStyleMixin({
        size: 12,
        color: '#999'
      })};

      &::before {
        content: '※';
        display: block;
        position: absolute;
        left: -15px;
      }
    }
  }
`;

const PriceSpan = styled.span`
  display: block;
  padding-top: 2px;
  line-height: 1.5;
  ${fontStyleMixin({
    size: 13,
    color: $GRAY
  })};
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

interface Props {
  className: string;
  optionState: TOptionState;
  prev: () => void;
}

const MeetupCommissionTabPC = React.memo<Props>(({
  className,
  optionState,
  prev
}) => {
  const [{itemById}] = optionState;
  
  const [agreement, setAgreement] = React.useState(false);
  
  const methods = useFormContext();
  const {watch} = methods;
  
  const options = watch('options');

  return (
    <>
      <SeminarBanner>
        <h2 className="title-h2">세미나/모임모집 개설약관 및 결제안내</h2>
      </SeminarBanner>
      <Div className={className}>
        <ul>
          <Responsiveli>
            <h3>개설약관</h3>
            <PaymentAgreement />
            <CheckBox
              checked={agreement}
              onChange={() => setAgreement(curr => !curr)}
            >
              세미나/모임 이용규정 약관 동의
            </CheckBox>
          </Responsiveli>
          <Responsiveli>
            <h3>결제 안내</h3>
            <div>
              <PriceTable>
                <tr>
                  <th>접수방법</th>
                  <td>한의플래닛 결제(카드결제)</td>
                </tr>
                <tr>
                  <th>개설 수수료</th>
                  <td>
                    - 오프라인 수수료 : 총 수강료 결제 금액의 5% <br/>
                    - 온라인 수수료 : 회사와 개설자 간 협의하에 정함
                  </td>
                </tr>
                <tr>
                  <th>선택옵션</th>
                  <td>
                    <ul>
                      {isEmpty(options)
                        ? <li>없음</li>
                        : options.map(id => {
                          const {name, is_call, price} = itemById[id];
                          
                          return (
                            <li key={`meetup-option-${id}`}>
                              {name}
                              <PriceSpan>{callOrPrice(is_call, price, '월')}</PriceSpan>
                            </li>
                          );
                        })}
                    </ul>
                    <span>일부 선택옵션에 따라 세미나 종료 후<br/> 추가 결제가 발생할 수 있습니다.</span>
                  </td>
                </tr>
              </PriceTable>
            </div>
          </Responsiveli>
          <StyledButtonGroup
            leftButton={{
              children: '이전',
              onClick: () => prev()
            }}
            rightButton={{
              children: '완료',
              type: agreement ? 'submit' : 'button',
              onClick: () => {
                if (!agreement) {
                  alert('동의가 필요합니다.');
                  return null;
                }
              }
            }}
          />
        </ul>
      </Div>
    </>
  );
});

MeetupCommissionTabPC.displayName = 'MeetupCommissionTabPC';
export default MeetupCommissionTabPC;
