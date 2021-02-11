import * as React from 'react';
import styled from 'styled-components';
import {PopupProps} from '../../common/popup/base/Popup';
import Confirm from '../../common/popup/Confirm';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR, $GRAY, $POINT_BLUE} from '../../../styles/variables.types';
import {pushPopup} from '../../../src/reducers/popup';
import {IMPPayment} from '../../../src/lib/payment';
import StoryApi from '../../../src/apis/StoryApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import PaymentApi from '../../../src/apis/PaymentApi';
import {useDispatch, useSelector} from 'react-redux';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {pickBandSelector} from '../../../src/reducers/orm/band/selector';
import OnClassExtensionAlert from './OnClassExtensionAlert';
import moment from 'moment';
import { updateBand } from '../../../src/reducers/orm/band/bandReducer';
import {useRouter} from 'next/router';
import {pickStorySelector} from '../../../src/reducers/orm/story/selector';
import { updateStory } from '../../../src/reducers/orm/story/storyReducer';
import OnClassApi from '../../../src/apis/OnClassApi';
import isEmpty from 'lodash/isEmpty';
import {IMeetupAnswer} from '../../../src/@types/IMeetUp';

const StyledConfirm = styled(Confirm)`
  .modal-body {
    width: 458px;

    .popup-title {
      padding: 21px 40px 24px;
  
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
      padding: 20px 24px 0;

      ul {
        li {
          position: relative;
          padding-left: 13px;
          ${fontStyleMixin({
            size: 12,
          })};

          ~ li {
            margin-top: 8px;
          }

          span {
            color: ${$POINT_BLUE};

            &.order {
              position: absolute;
              top: 0;
              left: 0;
              color: ${$FONT_COLOR};
            }
          }

          b {
            color: #f32b43;
            font-weight: normal;
          }
        }
      }

      p {
        margin-top: 30px;
        text-align: center;
        ${fontStyleMixin({
          size: 15,
          color: $GRAY,
        })};
      }
    }

    .button-group {
      padding: 20px 0 30px;
    }
  }
`;

interface Props extends PopupProps {
  product: {
    id: HashId;
    name: string;
    payPrice: number;
    band_slug: string;
    course_period: number;
  }
  pay_method: 'card' | 'kakaopay';
  status: string;
  end_date: string;
  answers?: IMeetupAnswer;
  isMeetup?: boolean;
}

const OnClassExtensionReconfirmPopup: React.FC<Props> = (({
  id,
  closePop,
  product: {
    id: productId,
    name: productName,
    payPrice,
    band_slug,
    course_period
  },
  status: learning_status,
  pay_method,
  answers,
  isMeetup
}) => {
  const dispatch = useDispatch();
  const {query: {id: slug}} = useRouter();
  const {onclass, me} = useSelector(({orm, system: {session: {id}}}) => ({
    onclass: (isMeetup ? pickStorySelector(slug)(orm) : pickBandSelector(band_slug)(orm)) || {},
    me: pickUserSelector(id)(orm),
  }));
  const {extension, onclass_periods} = onclass;
  const {periods: bandPeriods, story} = extension || {};
  const periods = isMeetup ? onclass_periods : bandPeriods;
  //수강연장/재수강이 끝나는 날짜를 계산하기 위한 코드
  const end_at = !isEmpty(periods)
    ? moment((periods[periods.length - 1] || {}).end_at).isBefore(moment())
      ? moment()
      : (periods[periods.length - 1] || {}).end_at
    : moment();
  const extendEndDate = moment(end_at).add(course_period, 'd');
  const {id: storyId} = story || {};
  const form = {products: [{id: productId, quantity: 1}], answers};
  const {name: onClassName, title: meetupName} = onclass || {};
  const {name, email, phone} = me || {};
  const storyApi: StoryApi = useCallAccessFunc(access => new StoryApi(access));
  const paymentApi: PaymentApi = useCallAccessFunc(access => new PaymentApi(access));
  const onClassApi: OnClassApi = useCallAccessFunc(access => access && new OnClassApi(access));

  return (
    <StyledConfirm
      id={id}
      closePop={closePop}
      title="결제 전 아래 사항을 확인해주시기 바랍니다."
      buttonGroupProps={{
        rightButton: {
          children: '동의',
          onClick: () => storyApi.reservation(isMeetup ? slug : storyId, form)
            .then(({data: {result}, status}) => {
              if (!!result && (status === 201)) {
                const {merchant_uid} = result;

                if (payPrice === 0) {
                  paymentApi.iamport({status: 'paid', merchant_uid})
                    .then(({status}) => {
                      if (status === 201) {
                        dispatch(pushPopup(OnClassExtensionAlert, {
                          title: isMeetup ? meetupName : onClassName,
                          end_date: extendEndDate.format('YYYY.MM.DD'),
                          status: learning_status
                        }));
                        if (isMeetup) {
                          dispatch(updateStory(
                            slug,
                            ({extension: {periods, onclass_learning_status}, my_applies, is_apply, ...curr}) => ({
                              ...curr,
                              extension: {
                                ...extension,
                                periods: [...(periods || []), {start_at: moment(), end_at: extendEndDate}],
                                onclass_learning_status: onclass_learning_status.split('_')[0]
                              },
                              is_apply: true,
                              my_applies: !!my_applies
                                ? [...my_applies, {answers, product_name: productName, price: payPrice}]
                                : [{answers, product_name: productName, price: payPrice}]
                            }),
                          ));
                        }
                        else {
                          dispatch(updateBand(
                            band_slug,
                            ({extension: {periods, learning_status, remaining_days}, ...curr}) => ({
                              ...curr,
                              extension: {
                                ...extension,
                                remaining_days: !!remaining_days
                                  ? remaining_days + course_period
                                  : course_period + 1 ,
                                periods: [...periods, {start_at: moment(), end_at: extendEndDate}],
                                learning_status: learning_status.split('_')[0]
                              }
                            }),
                          ));
                        }
                      }
                    })
                }

                else {
                  !!merchant_uid && IMPPayment({
                    pay_method,
                    merchant_uid,
                    name: productName,
                    amount: payPrice,
                    buyer_name: name,
                    buyer_email: email,
                    buyer_tel: phone,
                    onSuccess: ({status, imp_uid, merchant_uid}) => {
                      paymentApi.iamport({status, imp_uid, merchant_uid})
                        .then(({status}) => {
                          if (status === 201) {
                            dispatch(pushPopup(OnClassExtensionAlert, {
                              title: isMeetup ? meetupName : onClassName,
                              end_date: extendEndDate.format('YYYY.MM.DD'),
                              status: learning_status
                            }));
                            if (isMeetup) {
                              dispatch(updateStory(
                                slug,
                                ({extension: {periods, onclass_learning_status}, my_applies, is_apply, ...curr}) => ({
                                  ...curr,
                                  extension: {
                                    ...extension,
                                    periods: [...(periods || []), {start_at: moment(), end_at: extendEndDate}],
                                    onclass_learning_status: onclass_learning_status.split('_')[0]
                                  },
                                  is_apply: true,
                                  my_applies: !!my_applies
                                    ? [...my_applies, {answers, product_name: productName, price: payPrice}]
                                    : [{answers, product_name: productName, price: payPrice}]
                                }),
                              ));
                            }
                            else {
                              dispatch(updateBand(
                                band_slug,
                                ({extension: {periods, learning_status, remaining_days}, ...curr}) => ({
                                  ...curr,
                                  extension: {
                                    ...extension,
                                    remaining_days: !!remaining_days
                                      ? remaining_days + course_period
                                      : course_period + 1 ,
                                    periods: [...periods, {start_at: moment(), end_at: extendEndDate}],
                                    learning_status: learning_status.split('_')[0]
                                  }
                                }),
                              ));
                            }
                          }
                        })
                    }
                  });
                }
              } else {
                alert('결제 실패하였습니다')
              }
            })
        }
      }}
    >
      <ul>
        <li>
          <span className="order">1.</span>
          여러 기기에서 동시 수강은 <b>불가능</b>합니다.
        </li>
        <li>
          <span className="order">2.</span>
          수강생의 편의를 위해 자동으로 3종의 기기까지 등록이 되어 수강이 가능하며,
          3번째 기기 등록 후에는 <span>6개월 이후에 기기 리셋</span>이 가능합니다.
        </li>
        <li>
          <span className="order">3.</span>
          연장상품/재수강상품은 구입 시 환불이 <b>불가능</b>합니다.
        </li>
      </ul>
      <p>위 사항을 확인하시고 동의하십니까?</p>
    </StyledConfirm>
  )
});

export default React.memo(OnClassExtensionReconfirmPopup);
