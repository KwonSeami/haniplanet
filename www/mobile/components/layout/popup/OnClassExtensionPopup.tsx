import * as React from 'react';
import styled from 'styled-components';
import {PopupProps} from '../../common/popup/base/Popup';
import Confirm from '../../common/popup/Confirm';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR, $GRAY, $BORDER_COLOR} from '../../../styles/variables.types';
import {numberWithCommas} from '../../../src/lib/numbers';
import Radio from '../../UI/Radio/Radio';
import SelectBox from '../../inputs/SelectBox';
import {PAY_METHOD, TPayValue} from '../../../src/lib/payment';
import {pushPopup} from '../../../src/reducers/popup';
import {useDispatch} from 'react-redux';
import OnClassExtensionReconfirmPopup from './OnClassExtensionReconfirmPopup';
import moment from 'moment';
import {IMeetupAnswer, IPriceInfo} from '../../../src/@types/IMeetUp';

const StyledConfirm = styled(Confirm)`
  .modal-body {
    min-width: 300px;
    width: 300px;

    .popup-title {
      padding: 21px 37px 24px;
  
      h2 {
        position: relative;
        ${fontStyleMixin({
          size: 15,
          weight: 'bold',
        })};
  
        &::after {
          content: '';
          position: absolute;
          left: -18px;
          top: 8px;
          width: 11px;
          height: 5px;
          background-color: ${$FONT_COLOR};
        }
      }

      span {
        top: 17px;
        right: 16px;
      }
    }

    .popup-child {
      padding: 21px 18px 0;

      table {
        width: 100%;
        table-layout: fixed;
        border-top: 2px solid ${$FONT_COLOR};

        ~ table {
          margin-top: 12px;
        }

        tr {
          border-bottom: 1px solid #eee;
        }

        th {
          ${heightMixin(42)};
          padding: 0 0 0 10px;
          text-align: left;
          background-color: #f6f7f9;
          box-sizing: border-box;
          ${fontStyleMixin({
            size: 13,
            weight: 'normal',
          })};

          &:first-of-type {
            width: 110px;
          }

          &:nth-of-type(2) {
            width: 88px;
          }
        }

        td {
          padding: 12px 0 12px 10px;
          text-align: left;
          vertical-align: top;
          ${fontStyleMixin({
            size: 13,
            color: $GRAY,
          })};

          .radio {
            label {
              line-height: 20px;
              padding-left: 29px;
              font-size: 14px;
            }

            span {
              top: -2px;
              width: 24px;
              height: 24px;

              &::before {
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 8px;
                height: 8px;
              }
            }
          }
        }

        &.payment-info-table {
          th {
            width: 100px;
          }

          td {
            padding: 0 0 0 20px;
            font-size: 14px;
            vertical-align: middle;
          }
        }
      }

      > ul {
        margin-top: 10px;

        li {
          position: relative;
          padding-left: 14px;
          line-height: 17px;
          ${fontStyleMixin({
            size: 11,
            color: '#999'
          })};

          ~ li {
            margin-top: 4px;
          }

          span {
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }
    }

    .button-group {
      padding: 19px 0 30px;
    }
  }
`;

const StyledSelectBox = styled(SelectBox)`
  width: 83px;
  border-bottom: 0;

  ul {
    width: auto;
    white-space: nowrap;
    border-top: 1px solid ${$BORDER_COLOR};
    left: 0;
  }
`;

interface Props extends PopupProps{
  status: string;
  productList: IPriceInfo[],
  answers?: IMeetupAnswer[];
  selectedOption?: IPriceInfo;
  pay_method?: 'card' | 'kakaoPay';
  isMeetup?: boolean;
}

const OnClassExtensionPopup: React.FC<Props> = (({
  id,
  closePop,
  status,
  productList,
  answers,
  selectedOption,
  isMeetup,
  pay_method: defaultPayMethod
}) => {
  const dispatch = useDispatch();
  const [pay_method, setPayMethod] = React.useState<TPayValue>(defaultPayMethod || PAY_METHOD[0].value);
  const [selectedProduct, setSelectedProduct] = React.useState(selectedOption || productList[0]);

  const payPrice = React.useMemo(() => {
    const {sale_start_at, sale_end_at, sale_price, price} = selectedProduct || {};

    return !!sale_start_at && moment().isBetween(sale_start_at, sale_end_at, null, '[]')
      ? sale_price
      : price;
  }, [selectedProduct]);

  return (
    <StyledConfirm
      id={id}
      closePop={closePop}
      title={`${status}상품 구매하기`}
      buttonGroupProps={{
        rightButton: {
          children: '결제하기',
          onClick: () => {
            dispatch(pushPopup(OnClassExtensionReconfirmPopup, {
              product: {
                ...selectedProduct,
                payPrice,
              },
              status,
              pay_method,
              answers,
              isMeetup
            }))
          }
        }
      }}
    >
      <table>
        <caption className="hidden">{status} 가격표</caption>
        <tr>
          <th>상품명</th>
          <th>가격</th>
          <th>수강기간</th>
        </tr>
        {productList.map(product => {
            const {
              id,
              name,
              price,
              sale_price,
              sale_start_at,
              sale_end_at,
              course_period,
            } = product || {};

            const isInSale = !!sale_start_at && moment().isBetween(sale_start_at, sale_end_at, null, '[]');
            const payPrice = isInSale ? sale_price : price;

            return (
              <tr>
                <td>
                  <Radio
                    checked={selectedProduct.id === id}
                    onClick={() => setSelectedProduct(product)}
                  >
                    {name}
                  </Radio>
                </td>
                <td>{!!payPrice ? `${numberWithCommas(payPrice)}원` : '무료'}</td>
                <td>{course_period || 0}일</td>
              </tr>
            )
          }
        )}
      </table>
      <table className="payment-info-table">
        <caption className="hidden">결제 정보 안내표</caption>
        <tr>
          <th>구매 상품</th>
          <td>
            {selectedProduct.name}
          </td>
        </tr>
        <tr>
          <th>총 결제금액</th>
          <td>
            {!!payPrice ? `${numberWithCommas(payPrice)}원` : '무료'}
          </td>
        </tr>
        {payPrice !== 0 && (
          <tr>
            <th>결제 방법</th>
            <td>
              <StyledSelectBox
                option={PAY_METHOD}
                value={pay_method}
                onChange={value => setPayMethod(value as TPayValue)}
              />
            </td>
          </tr>
        )}
      </table>
      <ul>
        <li>
          <span>※</span> 여러 기기에서 동시 수강은 불가능합니다.
        </li>
        <li>
          <span>※</span> 수강생의 편의를 위해 자동으로 3종의 기기까지<br/>
          등록이 되어 수강이 가능하며, 3번째 기기 등록 후에는<br/>
          6개월 이후에 기기 리셋이 가능합니다.
        </li>
        <li>
          <span>※</span> 연장상품/재수강상품은 구입 시 환불이 불가능합니다.
        </li>
      </ul>
    </StyledConfirm>
  )
});

export default React.memo(OnClassExtensionPopup);
