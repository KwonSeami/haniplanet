import styled from 'styled-components';
import {$BORDER_COLOR, $FONT_COLOR, $GRAY, $POINT_BLUE, $WHITE, $TEXT_GRAY} from '../../../../styles/variables.types';
import {fontStyleMixin, heightMixin} from '../../../../styles/mixins.styles';

export const MeetupListUl = styled.ul`
  position: relative;
  margin-bottom: 12px;
  border-top: 1px solid ${$BORDER_COLOR};
  border-bottom: 0;

  & > li {
    position: relative;
    display: block;
    width: 100%;
    height: 43px;
    line-height: 42px;
    padding: 0 18px 0 90px;
    text-align: right;
    box-sizing: border-box;
    border-bottom: 1px solid ${$BORDER_COLOR};
    letter-spacing: -2px;
    ${fontStyleMixin({
      size: 18,
      weight: '300',
    })};

    &:nth-child(2) h3 {
      left: 15px;
    }

    h3 {
      position: absolute;
      left: 19px;
      top: 12px;
      padding-bottom: 3px;
      ${fontStyleMixin({
        size: 11,
        weight: 'bold',
      })};
    }

    img {
      width: 9px;
      display: inline-block;
      vertical-align: middle;
      margin: -2px 4px 0 0;
    }

    span {
      position: static;
      margin: -5px 0 0 7px;
      display: inline-block;
      vertical-align: middle;
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
    })};
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
    })};
  }

  .date {
    p {
      ${fontStyleMixin({
        color: `${$FONT_COLOR} !important`,
        weight: '300'
      })};
    }
    
    img {
      width: 16px;
      margin-right: 0;
    }
  }

  @media screen and (max-width: 680px) {
    padding-top: 3px;

    & > li {
      ${heightMixin(42)}
      border: 0;
      border-bottom: 1px solid ${$BORDER_COLOR};

      &:nth-child(2) h3 {
        left: 15px;
      }

      p {
        width: 100%;
        display: inline-block;
      }

      span {
        position: static;
        margin: -5px 0 0 7px;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
`;

export const SeminarDetailDiv = styled.div`
  .label {
    text-align: right;
    padding: 10px 0 20px;

    span {
      background-color: ${$POINT_BLUE};
      padding: 0 15px;
      display: inline-block;
      ${heightMixin(20)}
      ${fontStyleMixin({
        size: 11,
        weight: 'bold',
        color: $WHITE,
      })};
    }
  }
`;
export const Table = styled.table<Partial<Pick<Props, 'priceTable'>>>`
  margin-bottom: 20px;
  border-top: 2px solid ${$FONT_COLOR};

  th, td {
    text-align: left;
    padding: 7px 12px 11px 15px;
    box-sizing: border-box;
    border-bottom: 1px solid ${$BORDER_COLOR};
    ${fontStyleMixin({
      size: 15,
      weight: 'normal',
    })};

    span {
      color: ${$POINT_BLUE};
    }
  }

  th {
    width: 90px;
    font-size: 13px;
    background-color: #f6f7f9;
    vertical-align: top;
  }

  .price-wrapper {
    padding: 0;

    ul {
      padding: 4px 0; 

      li {
        display: block;
        padding: 3px 0 3px 15px;
        margin-top: 0;
        box-sizing: border-box;
        
        .meetup-price {
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

            .price-free {
              ${fontStyleMixin({
                size: 16,
              })};
            }
          }
        }
      }
    }
  }

  ${props => props.priceTable && `
    margin: 0;
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

  .payment-type {
    padding: 0;

    ul {
      li {
        display: block;
        padding: 10px 0 10px 15px;
        margin-top: 0;
        box-sizing: border-box;

        & ~ li {
          border-top: 1px solid #eee;
        }
  
        .meetup-price {
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
  }

  li {
    position: relative;
    display: table;
    width: 100%;
    margin-top: 6px;

    &:first-child {
      margin-top: 0;
    }
  }

  @media screen and (max-width: 680px) {
    .price-wrapper {
      ul {
        li {
          padding: 6px 0 11px 15px;
          
          & ~ li {
            border-top: 1px solid #eee;
          }
    
          .meetup-price {
            display: block;
            float: inherit;
          }
        }
      }
    }

    .payment-type {
      ul {
        li {
          .meetup-price {
            display: block;
            float: inherit;
            padding-top: 5px;
          }
        }
      }
    }
  }
`;

export const OnClassRefundWrapper = styled.div`
  .onclass-refund-date {
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

  ul:not(.onclass-seminar-notice) {
    display: block;
    width: 100%;
    margin-top: 10px;
    text-align: center;
    border-top: 2px solid #b3c4ce;
    background-color: ${$WHITE};

    &:first-of-type {
      margin-right: 4px;
    }

    &:last-of-type {
      margin-left: 4px;
    }

    li {
      box-sizing: border-box;
      ${heightMixin(30)};
      ${fontStyleMixin({
        size: 12,
      })};

      &:first-child {
        font-weight: 600;
        border-bottom: 1px solid ${$BORDER_COLOR};
      }
    }
  }

  .onclass-refund-explain {
    margin-top: 17px;
    line-height: 20px;
    ${fontStyleMixin({
      size: 13,
      color: $GRAY,
    })};

    > br {
      display: block;
    }

    span {
      display: inline-block;
    }
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

  @media screen and (min-width: 680px) {
    ul:not(.onclass-seminar-notice) {
      display: inline-block;
      width: calc(50% - 4px);

      &:first-of-type {
        margin-right: 4px;
      }
  
      &:last-of-type {
        margin-left: 4px;
      }
    }

    .onclass-refund-explain {
      margin-top: 10px;

      > br {
        display: none;
      }
    }
  }
`;

export const MeetupDetailUl = styled.ul`
  margin-top: -5px;
  padding: 0 15px;

  > li {
    margin-bottom: 10px;
    padding: 12px 14px;
    background-color: #f6f7f9;
    border-radius: 2px;
    border: 1px solid ${$BORDER_COLOR};
    ${fontStyleMixin({
      size: 13,
      color: $GRAY,
    })};

    h2 {
      ${fontStyleMixin({
        size: 13,
        weight: '600',
      })};
      padding-bottom: 6px;
    }
  }

  @media screen and (min-width: 680px) {
    padding: 0;
  }
`;
