import * as React from 'react';
import cn from 'classnames';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import StoryApi from '../../../../../src/apis/StoryApi';
import PaymentApi from '../../../../../src/apis/PaymentApi';
import PointApi from '../../../../../src/apis/PointApi';
import PointCalculator from './PointCalculator';
import PointChargeArea from './PointChargeArea';
import PointCompletePopup from '../../../../layout/popup/PointCompletePopup';
import useSaveApiResult from '../../../../../src/hooks/useSaveApiResult';
import useCallAccessFunc from '../../../../../src/hooks/session/useCallAccessFunc';
import {SimplifyPaidPayment} from '../../../../terms/PaidPayment';
import {IMPPayment} from '../../../../../src/lib/payment';
import {staticUrl} from '../../../../../src/constants/env';
import {pushPopup} from '../../../../../src/reducers/popup';
import {numberWithCommas} from '../../../../../src/lib/numbers';
import {updateUser} from '../../../../../src/reducers/orm/user/userReducer';
import {pickUserSelector} from '../../../../../src/reducers/orm/user/selector';
import {
  PaymentButton,
  PaymentButtonGroup,
  PaymentCheckBox,
} from '../../../../layout/popup/PointChargePopup';

const initialChargeErr = {
  productErr: false,
  paymentErr: false,
  agreementErr: false,
};

const chargeErrReducer = (state, {type, option}: any) => {
  switch (type) {
    case 'COMPLETE':
      return initialChargeErr;
    case 'ERROR':
      const {product, payment, agreement} = option;

      return {
        productErr: product,
        paymentErr: payment,
        agreementErr: agreement,
      };
    default:
      return state;
  }
};

const initalSelectItem = {
  product: {
    storyId: '',
    productId: '',
    productName: '',
    chargePoint: 0,
    pointPrice: 0,
  },
  // payment: '',
  payment: 'kakaopay',
  agreement: false,
};

const selectItemReducer = (state, {type, item}: any) => {
  switch (type) {
    case 'SELECT_PRODUCT':
      return {...state, product: item};
    case 'SELECT_PAYMENT':
      return {...state, payment: item};
    case 'AGREEMENT_TERMS':
      return {...state, agreement: !state.agreement};
    default:
      return state;
  }
};

interface Props {
  className?: string;
}

interface IHandleChargeArgs {
  succClbck?: (point: number) => void;
}

const PointCharge = React.memo(
  React.forwardRef<any, Props>((props, ref) => {
    const {className} = props;

    // State
    const [isShowAgreement, setAgreement] = React.useState(false);
    const [{productErr, paymentErr, agreementErr}, dispatchChargeErr] = React.useReducer(chargeErrReducer, initialChargeErr);
    const [{product, payment, agreement}, dispatchSelectItem] = React.useReducer(selectItemReducer, initalSelectItem);
    const {storyId, productId, productName, chargePoint, pointPrice} = product;

    // Redux
    const dispatch = useDispatch();
    const me = useSelector(
      ({orm, system: {session: {id}}}) => pickUserSelector(id)(orm) || {} as any,
      shallowEqual,
    );
    const {point} = me || {} as any;

    // Api
    const storyApi: StoryApi = useCallAccessFunc(access => new StoryApi(access));
    const paymentApi: PaymentApi = useCallAccessFunc(access => new PaymentApi(access));
    const pointApi: PointApi = useCallAccessFunc(access => new PointApi(access));
    const {resData: pointProduct = []} = useSaveApiResult(() => pointApi.product());

    React.useImperativeHandle(ref, () => ({
      handleClickChargeButton(args: IHandleChargeArgs = {}) {
        if (!!productId && !!payment && agreement) {
          dispatchChargeErr({type: 'COMPLETE'});

          storyApi.reservation(storyId, {
            products: [
              {id: productId, quantity: 1}
            ]
          })
            .then(({status, data: {result}}) => {
              if (Math.floor(status / 100) !== 4 && !!result) {
                const {merchant_uid} = result;
                const {name, email, phone} = me;

                !!merchant_uid && IMPPayment({
                  pay_method: payment,
                  merchant_uid,
                  name: productName,
                  amount: pointPrice,
                  buyer_name: name,
                  buyer_email: email,
                  buyer_tel: phone,
                  onSuccess: ({status, imp_uid, merchant_uid}) => {
                    const {succClbck} = args;

                    paymentApi.iamport({status, imp_uid, merchant_uid});
                    dispatch(updateUser(me.id, curr => ({...curr, point: curr.point + chargePoint})));
                    dispatch(pushPopup(PointCompletePopup, {type : 'CHARGE', point: chargePoint}));
                    succClbck(chargePoint);
                  }
                });
              }
            })
        } else {
          dispatchChargeErr({
            type: 'ERROR',
            option: {
              product: !productId,
              payment: !payment,
              agreement: !agreement,
            },
          });
        }
      }
    }));

    return (
      <PointChargeArea className={className}>
        <div>
          <div className="my-point">
            <h3>현재 나의 별</h3>
            <p>
              <img
                src={staticUrl("/static/images/icon/icon-point.png")}
                alt="현재 나의 별"
              />
              {numberWithCommas(point)}
            </p>
          </div>
          <div className="charge-point">
            <p>충전하실 별 개수를 선택하세요.</p>
            <ul className="point-menu">
              {pointProduct.map(({id: storyId, products}) => (
                products.filter(({price}) => price < 1000000).map(({id, text: productName, name, price: pointPrice}) => {
                  const chargePoint = Number(name);

                  return (
                    <li
                      key={`point-${storyId}-${id}`}
                      className={cn({on: productId === id})}
                      onClick={() => {
                        dispatchSelectItem({
                          type: 'SELECT_PRODUCT',
                          item: {storyId, productId: id, productName, chargePoint, pointPrice},
                        });
                      }}
                    >
                      <dl>
                        <dt>
                          <img
                            src={staticUrl("/static/images/icon/icon-point.png")}
                            alt="포인트"
                          />
                          <span>{numberWithCommas(chargePoint)}</span>개
                        </dt>
                        <dd>
                          <span>{numberWithCommas(pointPrice)}</span>원
                        </dd>
                      </dl>
                    </li>
                  );
                })
              ))}
            </ul>
            {productErr && (
              <span className="error">충전하실 별 개수를 선택하세요.</span>
            )}
          </div>
          <h3 style={{fontSize: '16px', fontWeight: 'bold'}}>카카오페이 충전 가능 금액</h3>
          <p style={{textAlign: 'center'}}>
            <img src={staticUrl('/static/images/temp/point-charge-table.jpg')} alt="포인트 충전 금액 테이블" />
          </p>
          <PointCalculator
            type="CHARGE"
            point={point}
            calculatedPoint={chargePoint}
            completePrice={pointPrice}
          />
          <div className="charge-guide">
            <h3>
              별 충전 안내
              <span>별 충전은 신용카드, 카카오페이로만 이용 가능합니다.</span>
            </h3>
            <PaymentButtonGroup
              leftButton={{
                children: (
                  <>
                    {payment === 'html5_inicis' && (
                      <img
                        src={staticUrl("/static/images/icon/check/icon-check-white.png")}
                        alt="신용카드"
                      />
                    )}
                    신용카드
                  </>
                ),
                onClick: () => {
                  dispatchSelectItem({
                    type: 'SELECT_PAYMENT',
                    item: 'html5_inicis'
                  });
                },
              }}
              rightButton={{
                children: (
                  <>
                    {payment === 'kakaopay' && (
                      <img
                        src={staticUrl("/static/images/icon/check/icon-check-black.png")}
                        alt="카카오페이"
                      />
                    )}
                    카카오페이
                  </>
                ),
                onClick: () => {
                  dispatchSelectItem({
                    type: 'SELECT_PAYMENT',
                    item: 'kakaopay'
                  });
                }
              }}
            />
            {paymentErr && (
              <span className="error">결제 수단을 선택해주세요.</span>
            )}
          </div>
          <div className="charge-agree">
            <PaymentCheckBox
              checked={agreement}
              onChange={() => dispatchSelectItem({type: 'AGREEMENT_TERMS'})}
            >
              유료 결제 서비스 약관을 확인하였습니다.
            </PaymentCheckBox>
            <PaymentButton
              className={cn({on: isShowAgreement})}
              font={{size: '11px'}}
              size={{width: '66px', height: '23px'}}
              border={{radius: '0', width: '1px', color: '#999'}}
              onClick={() => setAgreement(curr => !curr)}
            >
              내용 {isShowAgreement ? '접기' : '보기'} &nbsp;
              <img
                src={staticUrl("/static/images/icon/arrow/icon-mini-arrow.png")}
                alt="내용보기"
              />
            </PaymentButton>
            {agreementErr && (
              <span className="error">약관을 확인해주세요.</span>
            )}
            {isShowAgreement && (
              <SimplifyPaidPayment />
            )}
          </div>
        </div>
      </PointChargeArea>
    )
  })
);

export default PointCharge;
