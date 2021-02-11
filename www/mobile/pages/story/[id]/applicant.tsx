import * as React from 'react';
import moment from 'moment';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import loginRequired from '../../../hocs/loginRequired';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import Loading from "../../../components/common/Loading";
import {staticUrl} from '../../../src/constants/env';
import {numberWithCommas} from '../../../src/lib/numbers';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {fetchStoryThunk} from '../../../src/reducers/orm/story/thunks';
import {pickStorySelector} from '../../../src/reducers/orm/story/selector';
import {$TEXT_GRAY, $BORDER_COLOR, $POINT_BLUE, $WHITE, $FONT_COLOR, $GRAY} from '../../../styles/variables.types';
import { LEARNING_STATUS } from '../../../src/constants/meetup';

const Div = styled.div`
  background-color: #f6f7f9;
  padding: 50px 0;

  @media screen and (max-width: 680px) {
    padding: 0;
  }

  .pagination {
    margin: 0 auto;
  }
`;

const ApplicantUl = styled.ul`
  max-width: 680px;
  margin: auto;
  background-color: ${$WHITE};

  li {
    position: relative;
    padding: 18px 15px 18px 29px;
    box-sizing: border-box;
    border-bottom: 1px solid ${$BORDER_COLOR};

    .number {
      position: absolute;
      left: 15px;
      top: 20px;
      padding-top: 1px;
      box-sizing: border-box;
      ${fontStyleMixin({
        size: 12,
        weight: '600',
        family: 'Montserrat'
      })}
    }

    & > div {
      position: relative;
      width: 100%;
      padding-left: 56px;
      box-sizing: border-box;

      .avatar {
        position: absolute;
        left: 7px;
        top: -3px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }

      h2 {
        ${fontStyleMixin({
          size: 14,
          weight: '600'
        })}
      }

      > div {
        padding-bottom: 9px;
        margin: 6px 0 8px;
        border-bottom: 1px solid #eee;

        p {
          ${fontStyleMixin({
            size: 13,
            weight: '600',
            color: $GRAY,
          })};

          ~ p {
            margin-top: 4px;
          }

          &.off {
            color: ${$TEXT_GRAY};
          }
        }
      }

      .duration {
        margin-top: 4px;
        ${fontStyleMixin({
          size: 13,
          weight: '600',
          color: $GRAY
        })};

        span {
          ${fontStyleMixin({
            size: 13,
            weight: '600',
            color: $POINT_BLUE
          })};
        }

        &.off {
          color: #999;

          span {
            color: #999;
          }
        }
      }

      .answer {
        ${fontStyleMixin({
          size: 13,
          color: $GRAY
        })};

        &:first-of-type {
          margin-top: 10px;
        }
      }

      > span {
        display: block;
        padding-top: 4px;
        ${fontStyleMixin({
          size: 11,
          color: $TEXT_GRAY
        })};
        
        &.product {
          color: ${$FONT_COLOR};
          margin-right: 10px;
        }
      }
    }

    .status {
      position: absolute;
      right: 15px;
      top: 16px;
      ${fontStyleMixin({
        size: 11,
        weight: 'bold',
        color: $POINT_BLUE
      })};

      &.refund {
        color: #f32b43;
      }
    }
  }
`;

const test_id = '아이디들어가야함';

const PAYMENT_STATUS = {
  ongoing: '처리중',
  ok: '결제완료',
  refund: '환불완료',
  partial_refund: '부분환불'
};

const StoryApplicant: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {id: storyPk} = router.query;

  React.useEffect(() => {
    dispatch(fetchStoryThunk(storyPk));
  }, [storyPk]);

  const story = useSelector(
    ({orm}) => pickStorySelector(storyPk)(orm),
    shallowEqual,
  );

  if (!story || isEmpty(story)){
    return <Loading />;
  }

  const {
    applies = [],
    extension: {is_online_meetup, products}
  } = story;

  return (
    <Div>
      <ApplicantUl>
        {applies.map(({
          user,
          product: {
            id,
            name,
            price,
            sale_price,
            sale_start_at,
            sale_end_at
          },
          answers,
          status,
          created_at,
          onclass_info = {} as any
        }, idx) => {
          const isInSale = !!sale_start_at && moment(created_at).isBetween(sale_start_at, sale_end_at, null, '[]');
          const {periods = []} = onclass_info || {};
          const totalEndDate = !isEmpty(periods) && moment(periods[periods.length - 1].end_at);
          const isRefund = status === 'refund';

          return (
            <li key={`apply-${id}`}>
              <span className="number">{idx + 1}</span>
              <div>
                <img
                  src={user.avatar || staticUrl('/static/images/icon/icon-default-profile.png')}
                  alt="프로필 이미지"
                  className="avatar"
                />
                <h2>{user.name}({user.id})</h2>
                {((is_online_meetup && !isRefund) && !isEmpty(periods)) && (
                  <p className={cn('duration', {off: moment().isAfter(totalEndDate)})}>
                    <span>
                       {totalEndDate.format('YYYY.MM.DD')}
                    </span>
                    {moment().isAfter(totalEndDate) ? (
                      ' 수강 종료'
                    ) : (
                      '까지 수강 가능'
                    )}
                  </p>
                )}
                <div>
                  {(!is_online_meetup || !price)
                    ? (
                      <p>
                        {name}
                        <span className="point-circle">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
                        {!price ? '무료' : isInSale ? `${numberWithCommas(sale_price)}원` : `${numberWithCommas(price)}원`}
                      </p>
                    ) : (
                      periods.map(({end_at, learning_status}) => {
                        const isEndProduct = isRefund || moment(end_at).isBefore(moment());
                        const isNormalProduct = learning_status === 'normal';

                        return (
                          <p className={cn({off: isEndProduct})}>
                            {isNormalProduct
                              ? products[0].name
                              : LEARNING_STATUS[learning_status]
                            }
                            <span className="point-circle"/>
                            {learning_status === 'normal' && (
                              <>&nbsp;&nbsp;·&nbsp;&nbsp;
                                {!price ? '무료' : isInSale ? `${numberWithCommas(sale_price)}원` : `${numberWithCommas(price)}원`}
                              </>
                            )}
                          </p>
                        )
                      })
                    )
                  }
                </div>
                {answers.map(({answer}, idx) => (
                  <p className="answer">{idx + 1}. {answer}</p>
                ))}
                <span>{moment(created_at).format('YY.MM.DD hh:mm')}</span>
              </div>
              <span
                className={cn(
                'status',
                {refund: status === 'refund'}
              )}
              >
                {PAYMENT_STATUS[status]}
              </span>
            </li>
          )
        })}
      </ApplicantUl>
    </Div>
  )
});

export default loginRequired(StoryApplicant);
