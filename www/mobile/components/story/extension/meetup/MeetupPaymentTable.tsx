import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import {useSelector, shallowEqual} from 'react-redux';
import Button from '../../../inputs/Button';
import SelectBox from '../../../inputs/SelectBox';
import Radio from '../../../UI/Radio/Radio';
import {numberWithCommas} from '../../../../src/lib/numbers';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';
import {Table} from './common';
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';
import PaymentApi from '../../../../src/apis/PaymentApi';
import StoryApi from '../../../../src/apis/StoryApi';
import {IMPPayment, PAY_METHOD, TPayValue} from '../../../../src/lib/payment';
import styled from 'styled-components';
import {fontStyleMixin, heightMixin} from '../../../../styles/mixins.styles';
import {$FONT_COLOR, $WHITE, $BORDER_COLOR, $POINT_BLUE, $TEXT_GRAY} from '../../../../styles/variables.types';
import {useDispatch} from 'react-redux';
import PaySuccessPopup from './PaySuccessPopup';
import {pushPopup} from '../../../../src/reducers/popup';
import {HashId} from '../../../../../../packages/types';
import Input from '../../../inputs/Input';
import ButtonGroup from '../../../inputs/ButtonGroup';
import Router from 'next/router';
import moment from 'moment';
import {IPriceInfo} from '../../../../src/@types/IMeetUp';
import {RootState} from '../../../../src/reducers';
import OnClassExtensionPopup from '../../../layout/popup/OnClassExtensionPopup';
import {LEARNING_STATUS} from '../../../../src/constants/meetup';
import { updateStory } from '../../../../src/reducers/orm/story/storyReducer';
import { pickStorySelector } from '../../../../src/reducers/orm/story/selector';
import isPlainObject from 'lodash/isPlainObject';

interface Props {
  id: HashId;
  title: string;
  products: IPriceInfo[];
  questions: Array<object>;
  is_online_meetup: boolean;
}

const Section = styled.section`
  margin-top: -30px;

   h2 {
    padding: 0 15px 10px;
    ${fontStyleMixin({size: 15, weight: 'bold'})}
  }

  td.remove {
    padding-top: 0;
  }

  td li {
    display: inline-block;

    .radio span {
      top: 2px;
    }
  }

  .answer-box {
    margin-bottom: 50px;

    > div {
      padding: 10px 15px 15px;
      border-top: 2px solid ${$FONT_COLOR};
      border-bottom: 1px solid ${$BORDER_COLOR};

      p {
        margin-bottom: 6px;
        font-size: 13px;

        & ~ p {
          margin-top: 12px;
        }
      }

      input {
        padding: 0 10px;
        font-size: 15px;
      }
    }
  }

  @media screen and (min-width: 680px) {
    h2 {
      padding: 0 0 10px;
    }
  }
`;

const StyledSelectBox = styled(SelectBox)`
  width: 150px;

  li {
    margin-top: 0;
    box-sizing: border-box;
  }
`;

const StyledButton = styled(Button)`
  display: block;
  margin: 10px auto;
  width: 240px; 
  height: 39px;
  border-radius: 20px;
  ${fontStyleMixin({
    size: 15,
    weight: '600',
    color: $WHITE
  })};

  &:first-of-type {
    margin: 20px auto 8px;
  }

  &:last-of-type {
    margin: 10px auto 33px;
  }
`;

const StyledInput = styled(Input)`
  width: 100%;
  ${heightMixin(35)};

  &[type="text"] {
    border: 1px solid ${$BORDER_COLOR};
  }

  &[disabled] {
    background-color: #f5f7f9;
  }
`;

const StyledButtonGroup = styled(ButtonGroup)`
  margin: 17px 0 3px;

  li + li {
    padding-left: 10px;
  }

  button {
    width: 128px;
    ${heightMixin(33)};
    border-radius: 16.5px;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid #ccc;
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

const MeetupPaymentTable: React.FC<Props> = ({
  id,
  title,
  products= [],
  questions = [],
  is_online_meetup,
}) => {
  // Redux
  const dispatch = useDispatch();
  const {me, story} = useSelector(
    ({orm, system: {session: {id: userId}}}: RootState) => ({
      me: pickUserSelector(userId)(orm) || {},
      story: pickStorySelector(id)(orm) || {}
    }),
    shallowEqual,
  );
  const {user_type, name, email, phone, additional_data} = me || {};
  const {is_apply, extension, my_applies} = story || {};
  const {onclass_learning_status, status: offlineStatus} = extension || {};
  const {id: apply_id, answers = []} =  (my_applies || [])[0] || {};
  const status = is_online_meetup ? (onclass_learning_status || '') : (offlineStatus || '');
  const userKeyList = isPlainObject(additional_data) ? additional_data : {};

  // State
  const [selectedOption, setSelectedOption] = React.useState((products || [])[0] || []);
  const [userAnswers, setUserAnswers] = React.useState<Array<object | string>>(
    questions.map(({id}, idx) => ({
      id: (answers[idx] || {}).id || '',
      question_id: id,
      answer: (answers[idx] || {}).answer || ''
    }))
  );
  const [pay_method, setPayMethod] = React.useState<TPayValue>(PAY_METHOD[0].value);
  const [availableEdit, setAvailableEdit] = React.useState(!is_apply);
  const isOnlineMeetupPayed = is_online_meetup && is_apply;
  const isOfflineMeetupPayed = !is_online_meetup && is_apply;
  //isShowPayBtn이 TRUE면 결제가능목록, FALSE면 결제한 목록
  const [isShowPayBtn, setIsShowPayBtn] = React.useState(!is_apply);
  const statusKor = LEARNING_STATUS[status.split('_')[0]] || '';

  const payedPriceTotal = !!my_applies && (my_applies || []).reduce((prev, {price}) => {
    prev = prev + price;
    return prev;
  } , 0);
  
  
  // Api
  const storyApi: StoryApi = useCallAccessFunc(access => new StoryApi(access));
  const paymentApi: PaymentApi = useCallAccessFunc(access => new PaymentApi(access));

  // Hooks
  const filterProduct = React.useMemo(() => {
    if (!user_type) {
      return [];
    }

    const filteredProductsByUserType = (products || []).filter(({user_types}) => user_types.includes(user_type));
    const filteredProductsByUserKey = !isEmpty(userKeyList) &&
      filteredProductsByUserType.filter(({key = '', value}) => userKeyList[key] === value
    );

    const filteredList = !is_online_meetup
      ? filteredProductsByUserType
      : isEmpty(filteredProductsByUserKey)
        ? status === 'normal_avail'
          ? filteredProductsByUserType.filter(({key}) => !key)
          : filteredProductsByUserType.filter(({key, value = ''}) => (key === status.split('_')[0]) && (value === "True"))
        : filteredProductsByUserKey;

    setSelectedOption(filteredList[0]);
    return filteredList;
  }, [products, user_type, is_online_meetup, status]);

  const payPrice: number = React.useMemo(() => {
    if (isEmpty(filterProduct) || isEmpty(selectedOption)) {
      return 0;
    }
    const _payPrice = filterProduct.filter(({id}) => id === selectedOption.id)[0];
    const {sale_start_at, sale_end_at, sale_price, price} = _payPrice || {};
    const isInSale = !!sale_start_at && moment().isBetween(sale_start_at, sale_end_at, null, '[]');

    return Number(isInSale ? sale_price : price);
  }, [filterProduct, selectedOption]);

  React.useEffect(() => {
    setIsShowPayBtn(false);
  }, [is_apply, filterProduct]);

  const isPrepareToPay = React.useMemo(() => (!is_apply || isShowPayBtn), [isShowPayBtn, is_apply]);

  if (isEmpty(story)) {
    return null;
  }

  return (
    <Section>
      <ul>
        <li>
          <h2>결제 유형</h2>
          <Table>
            <tr>
              <th>구분</th>
              <td className="payment-type">
                {isPrepareToPay
                  ? !isEmpty(filterProduct)
                    ? (
                      <ul>
                        {(filterProduct || []).map(product => {
                          const {
                            id,
                            name,
                            text,
                            price,
                            sale_price,
                            sale_start_at,
                            sale_end_at
                          } = product || {};
                          const isInSale = !!sale_start_at && moment().isBetween(sale_start_at, sale_end_at, null, '[]');

                          return (
                            <li key={id}>
                              <Radio
                                checked={id === selectedOption.id}
                                onClick={() => setSelectedOption(product)}
                              >
                                {name}
                                &nbsp;
                                {text && `(${text})`}
                                <div className="meetup-price">
                                  <p>
                                    {isInSale
                                      ? ( //할인 기간
                                        <>
                                          <span className="discount-rate">
                                            {(((price - sale_price) / price) * 100).toFixed(0)}%
                                          </span>
                                          <b>{numberWithCommas(sale_price)}</b>원
                                          <span className="fixed-price">
                                            <b>{numberWithCommas(price)}</b>원
                                          </span>
                                        </>
                                      ) : <><b>{numberWithCommas(price)}</b>원</>
                                    }
                                  </p>
                                </div>
                              </Radio>
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <p>결제 가능한 타입이 존재하지 않습니다.</p>
                    )
                  : (
                    <ul>
                      {!!my_applies && my_applies.map(({
                        id,
                        product_name,
                        price,
                      }) => (
                        <li
                          className="clearfix"
                          key={id}
                        >
                          <Radio
                            checked={true}
                            onClick={() => null}
                          >
                            {product_name}
                          </Radio>
                          <div className="meetup-price">
                            <p>
                              <b>{numberWithCommas(price)}</b>원
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
              </td>
            </tr>
          </Table>
        </li>
        <li>
          <h2>결제 금액</h2>
          <Table>
            <tr>
              <th>주문 금액</th>
              <td>{numberWithCommas(isPrepareToPay ? payPrice : payedPriceTotal)}원</td>
            </tr>
            <tr>
              <th>총 결제금액</th>
              <td>{numberWithCommas(isPrepareToPay ? payPrice : payedPriceTotal)}원</td>
            </tr>
            {(isPrepareToPay && payPrice !== 0) && (
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
          </Table>
        </li>
        {!isEmpty(questions) && (
          <li className="answer-box">
            <h2>세미나 개설자가 작성한 신청 질문에 대한 답변을 입력해주세요.</h2>
            <div>
              {(questions || []).map(({id, question}, idx) => (
                <>
                  <p>{idx + 1}. {question}</p>
                  <StyledInput
                    type="text"
                    placeholder=""
                    disabled={!availableEdit}
                    onChange={({target: {value}}) => {
                      const _value = value || '';

                      setUserAnswers(curr => (
                        questions.length >= 2
                          ? idx === 0
                          ? [{id: curr[0].id, question_id: id, answer: (_value || '')}, curr[1]]
                          : [curr[0], {id: curr[1].id, question_id: id, answer: _value}]
                          : [{id: curr[0].id, question_id: id, answer: _value}]
                      ))
                    }}
                    value={userAnswers[idx].answer}
                  />
                </>
              ))}
              {is_apply && (
                <StyledButtonGroup
                  leftButton={{
                    children: !availableEdit ? '답변 수정' : '취소',
                    onClick: () => {
                      if (availableEdit && confirm('정말 변경된 내용을 취소 하시겠습니까?')) {
                        setUserAnswers(questions.map(({id}, idx) => ({
                          id: (answers[idx] || {}).id || '',
                          question_id: id,
                          answer: (answers[idx] || {}).answer || ''
                        })));
                        setAvailableEdit(!availableEdit)
                      }
                      else setAvailableEdit(!availableEdit)
                    }
                  }}
                  rightButton={{
                    children: '제출',
                    onClick: () => {
                      if (userAnswers.includes('')) {
                        alert('답변을 모두 채워주세요.');
                        return null;
                      } else if (availableEdit) {
                        storyApi.getAxios()
                          .patch(`/story/${id}/answer/`, {apply_id, answers: [...userAnswers]})
                          .then(({status}) => {
                            if (status === 200) {
                              alert('답변이 등록되었습니다.');
                              setAvailableEdit(false);
                            }
                          });
                      }
                    }
                  }}
                />
              )}
            </div>
          </li>
        )}
      </ul>
      {!isPrepareToPay && (
        <StyledButton
          backgroundColor={$TEXT_GRAY}
        >
          {is_online_meetup ? '결제' : '신청'} 완료
        </StyledButton>
      )}
      {(isPrepareToPay || (!is_online_meetup && !isOfflineMeetupPayed)) ?
        <StyledButton
          backgroundColor={$FONT_COLOR}
          onClick={() => {
            if (!(filterProduct || []).length) {
              alert('결제 가능한 타입이 존재하지 않습니다.');

              return null;
            }

            if (!isEmpty(questions) && !!userAnswers.find(({answer}) => answer === '')) {
              alert('해당 질문에 대한 답변을 입력해주세요.');
              return null;
            }

            if (!is_online_meetup) {
              if (confirm('참여자의 개인정보(이름, 연락처) 제 3자(개설자) 제공과 결제에 동의하시겠습니까?')) {
                const form = {products: [{id: selectedOption.id, quantity: 1}]};

                if (userAnswers.every(item => !!item)) {
                  form.answers = userAnswers;
                }

                storyApi.reservation(id, form)
                  .then(({data: {result}}) => {
                    if (!!result) {
                      const {merchant_uid} = result;

                      if (payPrice === 0) {
                        paymentApi.iamport({status: 'paid', merchant_uid});
                        dispatch(pushPopup(PaySuccessPopup, {bandName: title, bandSlug : selectedOption.band_slug || null}));
                        dispatch(updateStory(
                          id,
                          ({my_applies, is_apply, ...curr}) => ({
                            ...curr,
                            is_apply: true,
                            my_applies: !!my_applies
                              ? [...my_applies, {answers: userAnswers, product_name: selectedOption.name, price: payPrice}]
                              : [{answers: userAnswers, product_name: selectedOption.name, price: payPrice}]
                          }),
                        ));
                      } else {
                        !!merchant_uid && IMPPayment({
                          pay_method,
                          merchant_uid,
                          name: title,
                          amount: payPrice,
                          buyer_name: name,
                          buyer_email: email,
                          buyer_tel: phone,
                          onSuccess: ({status, imp_uid, merchant_uid}) => {
                            paymentApi.iamport({status, imp_uid, merchant_uid});
                            dispatch(pushPopup(PaySuccessPopup, {bandName: title, bandSlug : selectedOption.band_slug || null}));
                            setAvailableEdit(false);
                            dispatch(updateStory(
                              id,
                              ({my_applies, is_apply, ...curr}) => ({
                                ...curr,
                                is_apply: true,
                                my_applies: !!my_applies
                                  ? [...my_applies, {answers: userAnswers, product_name: selectedOption.name, price: payPrice}]
                                  : [{answers: userAnswers, product_name: selectedOption.name, price: payPrice}]
                              }),
                            ));
                          }
                        });
                      }
                    }
                  });
              }
            }
            else {
              if (!isEmpty(questions) && !!userAnswers.find(({answer}) => answer === '')) {
                alert('해당 질문에 대한 답변을 입력해주세요.');
                return null;
              } else {
                dispatch(pushPopup(OnClassExtensionPopup, {
                  status: statusKor,
                  productList: filterProduct,
                  selectedOption,
                  answers: userAnswers,
                  pay_method,
                  isMeetup: true
                }))
              }

            }
          }}
        >
          {is_online_meetup ? '결제하기' : '결제'}
        </StyledButton>
        : (isOnlineMeetupPayed && status.includes('_') && (offlineStatus !== 'end')) &&(
          <StyledButton
            backgroundColor={status === 'normal_avail' ? $FONT_COLOR : '#44d7b6'}
            onClick={() => {
              setIsShowPayBtn(true);
            }}
          >
            {status === 'normal_avail' ? '세미나 신청하기' : `${statusKor} 신청`}
          </StyledButton>
        )
      }
      {(isOnlineMeetupPayed && !isShowPayBtn) && (
        <StyledButton
          backgroundColor="#499aff"
          onClick={() => Router.push('/onclass/[id]', `/onclass/${products[0].band_slug}`)}
        >
          강의실 가기
        </StyledButton>
      )}
    </Section>
  );
};

export default React.memo(MeetupPaymentTable);
