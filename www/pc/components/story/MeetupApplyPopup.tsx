import * as React from 'react';
import cn from 'classnames';
import moment from 'moment';
import styled from 'styled-components';
import {useSelector, shallowEqual} from 'react-redux';
import Avatar from '../AvatarDynamic';
import TitlePopup, {TitleDiv} from '../common/popup/base/TitlePopup';
import {RootState} from "../../src/reducers";
import {PopupProps} from '../common/popup/base/Popup';
import {toFormattedDate} from '../../src/lib/date';
import {numberWithCommas} from "../../src/lib/numbers";
import {fontStyleMixin} from '../../styles/mixins.styles';
import {pickStorySelector} from '../../src/reducers/orm/story/selector';
import {$BORDER_COLOR, $FONT_COLOR, $TEXT_GRAY, $POINT_BLUE, $GRAY} from '../../styles/variables.types';
import {LEARNING_STATUS} from '../../src/constants/meetup';
import isEmpty from 'lodash/isEmpty';

const StyledTitlePopup = styled(TitlePopup)`
  .modal-body {
    width: 680px;
    padding-bottom: 40px;

    ${TitleDiv} h2 {
      position: relative;
      padding: 7px 0 10px 40px;
      ${fontStyleMixin({
        size: 15,
        weight: 'bold'
      })};

      &::after {
        content: '';
        position: absolute;
        top: 15px;
        left: 23px;
        width: 11px;
        height: 5px;
        background-color: ${$FONT_COLOR};
      }
    }
  }

  .list-wrapper {
    max-height: 634px;
    overflow-y: auto;
    border-bottom: 1px solid ${$BORDER_COLOR};

    .pagination {
      margin: 25px 0;
    }
  }
`;

const SeminarPopupUl = styled.ul`

  li {
    position: relative;
    padding: 18px 20px 13px 27px;
    margin: 0 20px;

    ~ li {
      border-top: 1px solid ${$BORDER_COLOR};
    }

    .number {
      position: absolute;
      left: 4px;
      top: 18px;
      text-align: center;
      box-sizing: border-box;
      ${fontStyleMixin({
        size: 12,
        weight: '600',
        family: 'Montserrat'
      })};
    }

    > div {
      position: relative;
      width: 100%;
      padding-left: 52px;
      box-sizing: border-box;

      .avatar {
        position: absolute;
        left: 0;
        top: 0;
      }

      h2 {
        ${fontStyleMixin({
          size: 14,
          weight: '600'
        })};

        .duration {
          position: relative;
          margin-left: 10px;
          padding-left: 10px;
          display: inline-block;

          &.off {
            color: #999;

            span {
              color: #999;
            }
          }
  
          &::before {
            content: '';
            position: absolute;
            top: 3px;
            left: 0;
            width: 1px;
            height: 14px;
            background-color: ${$BORDER_COLOR};
          }

          span {
            font-weight: 600;
            color: ${$POINT_BLUE};
          }
        }
      }

      .pay-item-info {
        padding-bottom: 13px;
        margin: 7px 0 10px;
        border-bottom: 1px solid ${$BORDER_COLOR};

        p {
          vertical-align: middle;
          ${fontStyleMixin({
            size: 13,
            weight: '600',
            color: $GRAY
          })};

          ~ p {
            margin-top: 4px;
          }

          &.off {
            color: ${$TEXT_GRAY};
          }

          .point-circle {
            color: ${$BORDER_COLOR};
          }
        }
      }

      p {
        line-height: 19px;
        ${fontStyleMixin({
          size: 13,
          color: $GRAY
        })};
      }

      > span {
        ${fontStyleMixin({
          size: 11,
          color: $TEXT_GRAY,
        })};
      }
    }

    .status {
      position: absolute;
      right: 17px;
      top: 21px;
      ${fontStyleMixin({
        size: 10,
        weight: 'bold',
        color: $POINT_BLUE
      })};

      &.refund {
        color: #f32b43;
      }
    }
  }
`;

const PAYMENT_STATUS = {
  ongoing: '처리중',
  ok: '결제완료',
  refund: '환불완료',
  partial_refund: '부분환불'
};

interface Props extends PopupProps {
  storyPk: HashId;
  is_online_meetup: boolean;
}

const MeetupApplyPopup = React.memo<Props>(
  ({storyPk, id, closePop, is_online_meetup}) => {
    const {applies = []} = useSelector(
      ({orm}: RootState) => pickStorySelector(storyPk)(orm),
      shallowEqual,
    );

    return (
      <StyledTitlePopup
        id={id}
        closePop={closePop}
        title="신청자 목록"
      >
        <div className="list-wrapper">
          <SeminarPopupUl>
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
              onclass_info = {} as any,
            }, idx) => {
              const isInSale = !!sale_start_at && moment().isBetween(sale_start_at, sale_end_at, null, '[]');
              const {periods = []} = onclass_info || {};
              const totalEndDate = !isEmpty(periods) && moment(periods[periods.length - 1].end_at);
              const isRefund = status === 'refund';

              return (
                <li key={`apply-${id}`}>
                  <span className="number">{idx + 1}</span>
                  <div>
                    <Avatar src={user.avatar} size={40}/>
                    <h2>
                      {user.name}({user.id})
                      {((is_online_meetup && status !== 'refund') && !isEmpty(periods)) && (
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
                    </h2>
                    <div className="pay-item-info">
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
                                  ? name
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
                        )}
                    </div>
                    {answers.map(({answer}, idx) => (
                      <p>{idx + 1}. {answer}</p>
                    ))}
                    <span>
                      {moment(new Date(created_at)).format('YY.MM.DD hh:mm')}
                    </span>
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
          </SeminarPopupUl>
        </div>
      </StyledTitlePopup>
    );
  },
);

export default MeetupApplyPopup;
