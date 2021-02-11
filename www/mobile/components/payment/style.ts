import styled from 'styled-components';
import { $WHITE, $BORDER_COLOR, $TEXT_GRAY, $POINT_BLUE, $GRAY, $FONT_COLOR } from '../../styles/variables.types';
import { fontStyleMixin, heightMixin } from '../../styles/mixins.styles';
import { IPaymentData } from '../../src/@types/payment';

export const Section = styled.section`
  padding: 80px 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #f3f4f5;

  @media screen and (max-width: 680px) {
    padding-top: 20px;
    height: auto;
    min-height: 500px;
  }
`;

export const PaymentDiv = styled.div`
  max-width: 680px;
  min-height: 300px;
  margin: auto;
`;


export const PaymentListLi = styled.li`
  background-color: ${$WHITE};
  padding: 10px 20px;
  border-bottom: 1px solid ${$BORDER_COLOR};
`;

export const PaymentTitle = styled.h2`
  ${fontStyleMixin({
    size: 15,
    weight: '600'
  })}

  span {
    display: block;
    ${fontStyleMixin({
      size: 13,
      color: $TEXT_GRAY
    })}
  }
`;

export const PaymentListInfoUl = styled.ul`
  position: relative;
`;

export const PriceLi = styled.li`
  float: left;
  padding-top: 7px;
  ${fontStyleMixin({
    size: 15,
    color: $TEXT_GRAY,
    weight: '600'
  })}
`;

export const LabelLi = styled.li<Pick<IPaymentData, 'status'>>`
  float: right;
  text-align: center;
  min-width: 75px;
  ${heightMixin(22)};
  padding:0 4px;
  border-radius: 14px;
  ${fontStyleMixin({
    size: 13, 
    color: $WHITE
  })};
  background-color: ${({status}) => status === 'ok'
    ? $POINT_BLUE
    : $TEXT_GRAY
  };
`;

export const DetailSeciton = styled.section`
  padding-top: 80px;
  margin-bottom: 20px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #f3f4f5;

  @media screen and (max-width: 680px) {
    padding-top: 20px;
    height: auto;
    min-height: 500px;
  }
`

export const DetailDiv = styled.div`
  padding: 20px 10px;
  max-width: 680px;
  margin: auto;
  box-sizing: border-box;
  background-color: ${$WHITE};
`;

export const H2 = styled.h2`
  padding: 0 0 10px 10px;
  ${fontStyleMixin({
    size: 15,
    weight: '600',
  })}

  span {
    padding: 5px 0 10px;
    font-size: 15px;
    display: block;
    color: ${$TEXT_GRAY}
  }
`;

export const Div = styled.div`
  margin-bottom: 30px;

  &.order-box {
    border: 2px solid #67aef6;
    border-radius: 4px;
    padding: 20px;

    ${H2} {
      padding: 0;
      border-bottom: 1px solid ${$BORDER_COLOR};
    }

    li {
      position: relative;
      padding-top: 10px;

      ${fontStyleMixin({
        size: 13,
        color: $GRAY,
      })}
    }
  }
`;

export const Span = styled.span`
  font-size: 13px;
  position: absolute;
  right: 0;
  top: 8px;
  letter-spacing: 0;

  &.price {
    ${fontStyleMixin({
      size: 17,
      weight: '600',
      color: $POINT_BLUE,
    })}
  }
`;

export const Table = styled.table`
  border-top: 2px solid ${$GRAY};

  th, td {
    text-align: left;
    box-sizing: border-box;
    border-bottom: 1px solid ${$BORDER_COLOR};
    font-size: 15px;
    padding: 9px 20px;
    line-height: 2;
  }

  th {
    background-color: #f3f4f5;
    width: 120px;
    font-size: 13px;
    padding: 9px 10px;
  }
`;

export const DetailProductUl = styled.ul`
  border-bottom: 1px solid ${$BORDER_COLOR};
  margin: 0 -10px;
`

export const DetailProductLi = styled.li`
  width: 100%;
  border-top: 1px solid ${$FONT_COLOR};

  &:last-child {
    border-bottom: ${$BORDER_COLOR};
  }

  & > dl {
    & > dt {
      position: relative;
      padding: 10px 15px;
      background-color: #f3f4f5;
      border-bottom: 1px solid ${$BORDER_COLOR};
      line-height: 1.5;
      ${fontStyleMixin({
        size: 16,
        color: $FONT_COLOR
      })};

      i {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        font-style: normal;
        ${fontStyleMixin({
          size: 12,
          color: $POINT_BLUE,
        })};
      }
    }
    & > dd {
      padding: 20px 15px;
      display: table;
      table-layout: fixed;
      width: 100%;
      box-sizing: border-box;
    }
    
    .thumbnail {
      display: table-cell;
      width: 40%;
      padding-right: 20px;
      vertical-align: middle;
      box-sizing: border-box;

      img {
        max-width: 100%;
      }
    }

    figure {
      margin: 0;
    }

    .info {
      display: table-cell;
      vertical-align: top;
    }

    dl {
      display: table;
      table-layout: fixed;
      width: 100%;

      & ~ dl {
        margin-top: 4px;
      }

      dt, dd {
        display: table-cell;
        line-height: 20px;
        vertical-align: top;
      }

      dt {
        width: 40%;
        ${fontStyleMixin({
          size: 13,
          color: $FONT_COLOR,
        })};
      }
      dd {
        text-align: right;
        ${fontStyleMixin({
          size: 12,
          color: $GRAY
        })};
      }
    }

    .detail {
      padding: 10px 5px;
      margin-top: 10px;
      border-top: 1px solid ${$BORDER_COLOR};

    }

    .btns {
      margin: -10px;
      margin-top: 15px;
      text-align: right;
      font-size: 0;

      button, a {
        display: inline-block;
        margin: 5px;
        width: calc(50% - 10px);
        border: 1px solid ${$BORDER_COLOR};
        box-sizing: border-box;
        text-align: center;
        ${heightMixin(30)};
        ${fontStyleMixin({
          size: 12,
          color: $FONT_COLOR
        })};

        &:nth-child(3) {
          width: calc(100% - 10px);
          ${heightMixin(35)};
          background-color: ${$FONT_COLOR};
          color: ${$WHITE};
          border: 0;
        }
      }
    }
  }
`;