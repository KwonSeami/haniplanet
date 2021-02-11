import * as React from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import Input from '../../../inputs/Input/InputDynamic';
import PointRefundTabArea from './style/PointRefundTabArea';
import PointCalculator from './PointCharge/PointCalculator';
import PointRefundsPopup from '../../../layout/popup/PointRefundsPopup';
import BasicButtonGroup from '../../../inputs/ButtonGroup/BasicButtonGroup';
import PointApi from '../../../../src/apis/PointApi';
import saveValueAtNameReducer from '../../../../src/lib/element/saveValueAtNameReducer';
import toggleValueAtNameReducer from '../../../../src/lib/element/toggleValueAtNameReducer';
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';
import {staticUrl} from '../../../../src/constants/env';
import {pushPopup} from '../../../../src/reducers/popup';
import {numberWithCommas} from '../../../../src/lib/numbers';
import {updateUser} from '../../../../src/reducers/orm/user/userReducer';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';
import {SimplifyPaidPayment} from '../../../terms/PaidPayment';
import {PaymentButton, PaymentCheckBox} from '../../../layout/popup/PointChargePopup';

interface Props {
  point: number;
}

const INITAL_REFUND_DATA = {
  amount: '',
  bank: '',
  account_number: '',
  registration_number: '',
  isAmountErr: '',
  isBankErr: '',
  isAgreementErr: '',
  isPayment: '',
};

const refundDataReducer = (state, action) => {
  switch (action.type) {
    case 'FIELD':
      return saveValueAtNameReducer(state, action);
    case 'ERROR':
      return {
        ...state,
        ...action.error,
      };
    default:
      return state;
  }
};

// TODO: 기존 환급 동의 체크박스의 변수이름이 isAgreement 이였지만,
//       유료 서비스 약관 동의 체크박스가 추가 되면서 isPayment로 이름을 변경하고
//       추가 된 환급 내용을 확인하였다는 체크박스를 isAgreement로 지정하였습니다.
//       확인 부탁 드립니다.

const INITAL_AGREEMENT = {
  isAgreement: false,
  isPayment: false,
  isShowPayment: false,
};

const PointRefundTab = React.memo<Props>(props => {
  const {point} = props;

  // State
  const [
    {amount, name, registration_number, bank, account_number, isAmountErr, isBankErr, isAgreementErr, isPaymentErr},
    dispatchRefundData
  ] = React.useReducer(
    refundDataReducer,
    INITAL_REFUND_DATA
  );
  const [
    {isAgreement, isPayment, isShowPayment},
    dispatchAgreement
  ] = React.useReducer(
    toggleValueAtNameReducer,
    INITAL_AGREEMENT
  );

  // Redux
  const dispatch = useDispatch();
  const me = useSelector(
    ({orm, system: {session: {id}}}) => pickUserSelector(id)(orm) || {} as any,
    shallowEqual,
  );

  const handleOnChangeRefundData = ({target: {name, value}}) => {
    dispatchRefundData({type: 'FIELD', name, value});
  };

  // Api
  const pointApi: PointApi = useCallAccessFunc(access => new PointApi(access));

  return (
    <PointRefundTabArea>
      <p>환급 받을 별과 금액을 확인해주세요.</p>
      <div className="refund-box">
        <h2>
          총
          <span>
            <img
              src={staticUrl('/static/images/icon/icon-point.png')}
              alt="총 포인트"
            />
            <strong>{numberWithCommas(point)}</strong>개
          </span>
        </h2>
        <p>
          <Input
            className="point-input"
            placeholder="별 개수를 입력해주세요."
            numberOnly
            name="amount"
            value={amount}
            onChange={handleOnChangeRefundData}
          />개
        </p>
        {isAmountErr && (
          <span className="error">{isAmountErr}</span>
        )}
      </div>
      <PointCalculator
        type="REFUND"
        point={point}
        calculatedPoint={amount}
        completePrice={Number(amount) * 80}
      />
      <div className="refund-account">
        <h3>
          계좌 환급 안내
        </h3>
        <div>
          <PaymentCheckBox
            checked={isAgreement}
            onChange={() => dispatchAgreement({name: 'isAgreement'})}
          >
            환급 내용을 확인하였습니다.
          </PaymentCheckBox>
        </div>
        {isAgreementErr && (
          <span className="error">{isAgreementErr}</span>
        )}
        <div className="terms-scroll">
          <p>
            1. 환급 정산일 안내<br />
            1) 매월 1일부터 15일까지 환전 신청을 한 경우: 23일 입금 처리<br />
            매월 16일부터 말일까지 환전 신청을 한 경우: 익월 9일 입금 처리<br />
            2) 환전 신청 금액에 대하여 기타소득(원고료) 원천징수 후 잔액을 입금합니다. 자세한 내용은 국세청 전화 126 또는 관할 세무서 민원실 등 전문가의 상담을 통하여 사업자 등록 여부를 판단하셔야 합니다.<br />
            <br />
            2.  환급 수수료 및 환급 가능 금액<br />
            - 별 환급 시, 환급 수수료 20%가 부과됩니다.<br />
            -  환급가능한 1회 최소 별은 500별(4만원) / 1일 최대 별은 2500별(20만원) 입니다.<br />
            <br />
            3. 국세청 소득신고를 위한 실명, 주민등록 번호를 수집하고 있습니다. 
            <br />
            정보통신방법 제 15조(개인정보 보호조치)2항에 따라, 주민등록번호, 계좌정보 및 바이오정보(지문,홍채, 음성, 필적 등 개인을 식별할 수 있는 신체적 또는 행동적 특징에 관한 정보를 말한다) 등 방송통신위원회가 고시하는 정보의 암호화 저장을 하여 분리·보관하고 있습니다. <br />
            입금 완료 및 소득 신고 후에 즉시 폐기되오니 안심하셔도 됩니다.<br />
            또한, 정확한 본인 확인을 위해, 본인명의의 은행명과 계좌번호를 꼭 입력 부탁드립니다.<br />
          </p>
        </div>
        <span className="terms-info">※ 국세청 소득신고 및 정확한 본인확인을 위해 실명과 주민등록번호 입력 후, 본인 명의의 은행명과 계좌번호를 입력해주세요.</span>
        <ul>
          <li>
            <Input
              className="account-input"
              placeholder="실명"
              // TODO: 임의로 변수명을 지정하였으니 작업하실 때 확인해주세요.
              name="name"
              value={name}
              onChange={handleOnChangeRefundData}
            />
          </li>
          <li>
            {/* TODO: password 형식으로 숫자만 입력 되게 해주세요. */}
            <Input
              className="account-input"
              placeholder="주민등록번호(‘-’없이 입력)"
              numberOnly
              // TODO: 임의로 변수명을 지정하였으니 작업하실 때 확인해주세요.
              name="registration_number"
              value={registration_number}
              onChange={handleOnChangeRefundData}
              type="password"
            />
            {/* TODO: 숫자 입력시 해당 숫자가 보이게 해주세요.*/}
            <span>{registration_number[registration_number.length - 1]}</span>
          </li>
        </ul>
        <ul>
          <li>
            <Input
              className="account-input"
              placeholder="은행명 입력"
              name="bank"
              value={bank}
              onChange={handleOnChangeRefundData}
            />
          </li>
          <li>
            {/* TODO: password 형식으로 숫자만 입력 되게 해주세요. */}
            <Input
              className="account-input"
              placeholder="계좌번호 입력(‘-’없이 입력)"
              numberOnly
              name="account_number"
              value={account_number}
              onChange={handleOnChangeRefundData}
            />
          </li>
        </ul>
        {isBankErr && (
          <span className="error">{isBankErr}</span>
        )}
        <div>
          <PaymentCheckBox
            checked={isPayment}
            onChange={() => dispatchAgreement({name: 'isPayment'})}
          >
            유료 결제 서비스 약관을 확인하였습니다.
          </PaymentCheckBox>
          <PaymentButton
            className={cn({on: isShowPayment})}
            font={{size: '11px'}}
            size={{width: '66px', height: '21px'}}
            border={{radius: '0', width: '1px', color: '#999'}}
            onClick={() => dispatchAgreement({name: 'isShowPayment'})}
          >
            내용 {isShowPayment ? '접기' : '보기'} &nbsp;
            <img
              src={staticUrl('/static/images/icon/arrow/icon-mini-arrow.png')}
              alt="내용보기"
            />
          </PaymentButton>
          {isPaymentErr && (
            <span className="error">{isPaymentErr}</span>
          )}
        </div>
        {isShowPayment && (
          <SimplifyPaidPayment />
        )}
      </div>
      <BasicButtonGroup
        leftButton={{children: '취소'}}
        rightButton={{
          children: '확인',
          onClick: () => {
            const error = {
              isAmountErr: '',
              isAgreementErr: !isAgreement ? '환급 내용을 확인해주세요.' : '',
              isBankErr: !bank ? '은행명을 입력해주세요.' : !account_number ? '계좌번호를 입력해주세요' : '',
              isPaymentErr: !isPayment ? '약관을 확인해주세요.' : '',
            } as any;

            if (!amount) {
              error.isAmountErr = '환급하실 별 개수를 입력해주세요.';
            } else if (!Number(amount)) {
              error.isAmountErr = '1개 이상의 별을 입력해주세요.';
            } else if (Number(amount) > point) {
              error.isAmountErr = '보유하신 별이 부족합니다.';
            } else if (Number(amount) < 500) {
              error.isAmountErr = '1회 최소 500별(4만원) 이상부터 환급됩니다.';
            }

            if (Object.values(error).every(item => !item)) {
              pointApi.withdrawal({amount: Number(amount), bank, account_number, name, registration_number})
                .then(({status, data: {won}}) => {
                  if (Math.floor(status / 100) === 2) {
                    dispatch(pushPopup(PointRefundsPopup, {won}));
                    dispatch(updateUser(
                      me.id,
                      curr => ({
                        ...curr,
                        point: curr.point - Number(amount),
                        withdrawal_ongoing_points: curr.withdrawal_ongoing_points + Number(amount),
                      })
                    ));
                  }
                });
            } else {
              dispatchRefundData({type: 'ERROR', error});
            }
          }
        }}
      />
    </PointRefundTabArea>
  );
});

export default PointRefundTab;
