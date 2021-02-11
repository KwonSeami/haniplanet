import styled from 'styled-components';
import {$WHITE, $BORDER_COLOR, $TEXT_GRAY, $POINT_BLUE, $GRAY, $FONT_COLOR} from '../../styles/variables.types';
import {fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {CartTable} from '../shopping/style/order';
import {IPaymentData} from '../../src/@types/payment';
import Button from '../inputs/Button';

const CONTENT_WIDTH = 1090;

export const PaymentItemLi = styled.li`
  border-bottom: 1px solid ${$BORDER_COLOR};

  table {
    table-layout: fixed;

    td {
      vertical-align: middle;
      text-align: center;
      font-size: 14px;

      &.img {
        width: 200px;

        .cropped-image {
          margin: 20px 25px;
        }
      }

      &.title {
        text-align: left;

        h4 {
          margin-bottom: 3px;
          ${fontStyleMixin({
            size: 16,
            weight: '600',
          })};
        }

        p {
          font-size: 14px;
        }
      }

      &.quantity {
        width: 154px;
      }

      &.price {
        width: 154px;
      }

      &.state {
        width: 190px;
        
        p {
          display: block;
          margin-bottom: 15px;
          line-height: 14px; 
          ${fontStyleMixin({
            size: 14,
            weight: 'bold'
          })};
        }

        a {
          display: inline-block;
          width: 110px;
          height: 34px;
          color: ${$WHITE};
          border: 0;
          background-color: ${$FONT_COLOR};
          line-height: 34px;
        }

        a + div {
          margin-top: 8px;
        }

        button {
          font-size: 13px;
          width: 53px;
          height: 34px;
          border-radius: 2px;
          border: 1px solid ${$BORDER_COLOR};
          background-color: ${$WHITE};
          cursor: pointer;

          & ~ button {
            margin-left: 4px;
          }
        }
      }
    }
  }
`

export const Section = styled.section`
  padding-bottom: 25px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #f3f4f5;
`;

export const Title = styled.h1`
  width: ${CONTENT_WIDTH}px;
  padding: 50px 0 20px;
  margin:0 auto;
  line-height: 1;
  ${fontStyleMixin({
    size: 24,
    color: $FONT_COLOR,
    weight: '500'
  })}
`;

export const PaymentDiv = styled.div`
  width: ${CONTENT_WIDTH}px;
  min-height: 500px;
  margin: auto;
`;

export const PaymentMoreButton = styled(Button)`
  border-top: 0;
  border-left: 0;
  border-right: 0;
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
  padding: 0 4px;
  border-radius: 14px;
  ${fontStyleMixin({
    size: 13,
    color: $WHITE
  })}
  background-color: ${({status}) => status === 'ok'
    ? $POINT_BLUE
    : $TEXT_GRAY
  };
`;


export const DetailDiv = styled.div`
  padding: 20px;
  width: ${CONTENT_WIDTH}px;
  margin: auto;
  box-sizing: border-box;
  background-color: ${$WHITE};
`;

export const H2 = styled.h2`
  position: relative;
  padding-bottom: 10px;
  ${fontStyleMixin({
  size: 17,
  weight: '600',
})}

  span {
    color: ${$TEXT_GRAY}
  }
`;

export const Div = styled.div`
  margin-bottom: 30px;

  &.order-box {
    border: 2px solid #67aef6;
    border-radius: 4px;
    padding: 20px;

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
  font-size: 15px;
  position: absolute;
  right: 0;
  top: 0;
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

export const StyledCartTable = styled(CartTable)`
  border-top: 2px solid ${$GRAY};

  td {
    width: 13%;
    &.thumbnail {
      width: 100px;
    }

    &.state {
      width: 150px;
    }
  }
`;

export const GuideDiv = styled.div`
  padding: 25px 20px;
  background-color: #f7f7f7;
  border: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;

  .title {
    margin-bottom: 40px;
    line-height: 1;
    ${fontStyleMixin({
      size: 18,
      color: $FONT_COLOR,
    })};
  }

  dl {
    display: table;
    table-layout: fixed;
    width: 100%;
    padding-left: 10px;
    box-sizing: border-box;

    & ~ dl {
      margin-top: 10px;
    }

    & + .title {
    margin-top: 50px;
  }
  }
  
  dt, dd {
    display: table-cell;
    vertical-align: top;
    line-height: 1.5;
    font-size: 14px;
  }

  dt {
    width: 150px;
    ${fontStyleMixin({
      color: $GRAY,
      weight: 'bold'
    })}
  }

  dd {
    color: #999;

    em {
      color: ${$GRAY};
      font-style: normal;
    }
  }
`;