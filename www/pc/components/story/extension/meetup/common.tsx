import styled from 'styled-components';
import {$BORDER_COLOR, $FONT_COLOR, $GRAY, $POINT_BLUE, $WHITE, $TEXT_GRAY} from '../../../../styles/variables.types';
import {fontStyleMixin, heightMixin} from '../../../../styles/mixins.styles';

export const MeetupListUl = styled.ul`
  position: relative;
  padding: 5px 0 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${$BORDER_COLOR};

  & > li {
    display: inline-block;
    vertical-align: middle;
    padding: 0 41px 0 17px;
    box-sizing: border-box;
    border-left: 1px solid ${$BORDER_COLOR};
    letter-spacing: -2px;
    ${fontStyleMixin({
      size: 18,
      weight: '300',
    })}

    &.place {
      width: 175px;
    }

    h3 {
      padding-bottom: 3px;
      ${fontStyleMixin({
        size: 11,
        weight: 'bold',
      })}
    }

    img {
      width: 9px;
      display: inline-block;
      vertical-align: middle;
      margin: -2px 4px 0 0;
    }
  }

  ul li {
    width: auto;
    padding: 0;
    border: 0;
    letter-spacing: 0;
    font-family: 'Montserrat';

    &:first-child {
      padding-right: 14px;
    }
  }

  p {
    letter-spacing: 0;
    ${fontStyleMixin({
      color: $POINT_BLUE,
      family: 'Montserrat',
      weight: '300'
    })}
  }

  span {
    position: absolute;
    right: 2px;
    bottom: 11px;
    display: inline-block;
    padding: 0 15px;
    ${heightMixin(21)};
    background-color: ${$POINT_BLUE};
    ${fontStyleMixin({
      size: 11,
      weight: 'bold',
      color: $WHITE,
    })}
  }

  .date {
    width: 280px;

    p {
      ${fontStyleMixin({
        color: `${$FONT_COLOR} !important`,
        weight: '300'
      })}
    }
    
    img {
      width: 16px;
      margin-right: 0;
    }
  }
`;

export const Table = styled.table<Partial<Pick<Props, 'priceTable'>>>`
  margin-bottom: 10px;
  border-top: 2px solid ${$FONT_COLOR};

  th {
    width: 120px;
    padding: 9px 15px 0;
    text-align: left;
    vertical-align: top;
    background-color: #f6f7f9;
    box-sizing: border-box;
    border-bottom: 1px solid ${$BORDER_COLOR};
    ${fontStyleMixin({
      size: 13,
      weight: 'normal',
    })};

    span {
      color: ${$POINT_BLUE};
    }
  }

  td {
    text-align: left;
    padding: 7px 20px 11px;
    box-sizing: border-box;
    border-bottom: 1px solid ${$BORDER_COLOR};
    ${fontStyleMixin({
      size: 15,
      weight: 'normal',
    })};

    span {
      color: ${$POINT_BLUE};
    }

    &.payment-type {
      padding: 0;

      li {
        border-bottom: 1px solid #eee;
        padding: 10px 20px;
      }

      > p {
        padding: 7px 20px 11px;
      }
    }

    li {
      position: relative;

      ~ li {
        padding-top: 6px;
      }
  
      .radio {
        display: inline-block;
      }
        
      .price-free {
        margin-left: 6px;
        ${fontStyleMixin({
          size: 16,
        })};
      }
      
      .meetup-price {
        position: relative;
        right: -20px;
        display: inline-block;
        float: right;
        box-sizing: border-box;
  
        p {
          ${fontStyleMixin({
            size: 11,
          })};
  
          .discount-rate {
            margin-right: 6px;
            ${fontStyleMixin({
              size: 16,
              weight: '600',
              family: 'Montserrat',
              color: '#f32b43'
            })};
          }
      
          > b {
            ${fontStyleMixin({
              size: 16,
              weight: '600',
              family: 'Montserrat',
            })};
          }
  
          .fixed-price {
            margin-left: 6px;
            ${fontStyleMixin({
              size: 11,
              color: $TEXT_GRAY
            })};
  
            b {
              text-decoration: line-through;
              ${fontStyleMixin({
                size: 12,
                weight: '600',
                family: 'Montserrat',
                color: $TEXT_GRAY
              })};
            }
          }
        }
      }
    }
  }

  ${props => props.priceTable && `
    margin-bottom: 0;
    border-color: #b3c4ce;

    th, td {
      text-align: center;
      font-size: 12px;
      padding: 5px 0;
      background-color: ${$WHITE};
    }

    th {
      width: auto;
    }
  `}

  ${props => props.onclassPriceTable && `
    margin-bottom: 0;
    border-color: #b3c4ce;

    th, td {
      width: 50%;
      text-align: center;
      font-size: 12px;
      padding: 6px 0;
      background-color: ${$WHITE};

      &:first-of-type {
        border-right: 8px solid #f6f7f9;
      }
    }

    th {
      width: auto;
      ${fontStyleMixin({
        size: 12,
        weight: 'bold',
      })};
    }
  `}
`;

export const OnClassRefundWrapper = styled.div`
  .onclass-refund-date {
    margin-bottom: 9px;
    ${fontStyleMixin({
      size: 15,
      weight: '600',
      color: $GRAY,
    })};

    span {
      ${fontStyleMixin({
        size: 15,
        weight: '600',
        color: '#f32b43'
      })};
    }
  }

  .onclass-refund-explain {
    margin-top: 10px;
    line-height: 20px;
    ${fontStyleMixin({
      size: 13,
      color: $GRAY,
    })};
  }

  .onclass-seminar-notice {
    margin-top: 9px;

    li {
      position: relative;
      padding-left: 13px;
      line-height: 20px;
      ${fontStyleMixin({
        size: 13,
        color: $GRAY,
      })};

      ~ li {
        margin-top: 8px;
      }

      span {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }

  .onclass-refund-explain {
    margin-top: 10px;
    line-height: 20px;
    ${fontStyleMixin({
      size: 13,
      color: $GRAY,
    })};
  }
`;

export const MeetupDetailUl = styled.ul`
  > li {
    margin-bottom: 10px;
    padding: 12px 14px;
    background-color: #f6f7f9;
    border-radius: 2px;
    border: 1px solid ${$BORDER_COLOR};
    ${fontStyleMixin({
      size: 13,
      color: $GRAY,
    })}

    h2 {
      ${fontStyleMixin({
        size: 13,
        weight: '600',
      })}
      padding-bottom: 10px;
    }

    .map {
      max-height: 367px;
      overflow: hidden;
    }
  }
`;
