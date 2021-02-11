import styled from 'styled-components';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE} from '../../../../../styles/variables.types';
import {PaymentButton} from '../../../../layout/popup/PointChargePopup';

const PointRefundTabArea = styled.div`
  position: relative;
  border-top: 1px solid ${$BORDER_COLOR};

  & > p {
    padding: 20px 0 15px;
    font-size: 14px;
    text-align: center;
  }

  div {
    max-width: 680px;
    margin: auto;

    .error {
      display: block;
      padding-top: 3px;
      ${fontStyleMixin({
        size: 11,
        color: '#f32b43',
      })}
    }

    .refund-box {
      padding: 0 0 19px;

      @media screen and (max-width: 680px) {
        padding: 0 15px 19px;
      }
      
      h2 {
        padding-bottom: 8px;
        ${fontStyleMixin({
          size: 15,
          weight: '600',
        })}

        img {
          display: inline-block;
          vertical-align: middle;
          width: 15px;
          margin: -4px 3px 0 0;
        }

        span {
          display: inline-block;
          vertical-align: middle;
          padding-left: 11px;
          ${fontStyleMixin({
            size: 15,
            weight: '600',
            color: $POINT_BLUE,
          })}

          strong {
            ${fontStyleMixin({
              size: 18,
              weight: '500',
              color: $POINT_BLUE,
              family: 'Montserrat',
            })}
          }
        }
      }

      p {
        height: 40px;
        padding: 2px 14px 2px 11px;
        border: 1px solid ${$BORDER_COLOR};
        box-sizing: border-box;
        font-size: 14px;
      }
      
      .point-input {
        width: calc(100% - 13px);
        height: 34px;
        display: inline-block !important;
        vertical-align: middle;
        padding-right: 5px;
      }
    }

    .refund-account {
      padding: 21px 0 40px;

      @media screen and (max-width: 680px) {
        padding: 21px 15px 40px;
      }

      h3 {
        padding-top: 10px;
        font-size: 16px;

        span {
          display: block;
          padding-top: 5px;
          ${fontStyleMixin({
            size: 12,
            color: $GRAY,
          })}
        }
      }
    
      .terms-scroll {
        border: 1px solid ${$BORDER_COLOR};
        padding: 10px 20px;
        height: 130px;
        box-sizing: border-box;
        border-radius: 2px;
        margin-top: 10px;
        overflow-y: auto;

        p {
          font-size: 13px;
          line-height: 22px;
        }
      }

      .terms-info {
        display: block;
        padding: 11px 0 16px;
        ${fontStyleMixin({
          size: 11,
          color: '#999',
        })};
      }

      ul + ul {
        margin-top: 5px;
      }

      li {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        width: 120px;
        padding-right: 5px;
        box-sizing: border-box;

        &:last-child {
          width: calc(100% - 120px);
          padding: 0;
        }
      
        .account-input {
          width: 100%;
          height: 40px;
          padding: 0 13px;
          border: 1px solid ${$BORDER_COLOR} !important;
        }
      
        span {
          position: absolute;
          top: 50%;
          right: 14px;
          transform: translateY(-50%);
          font-size: 14px;
        }
      }

      & > div {
        position: relative;
        padding-top: 10px;

        ${PaymentButton} {
          top: 10px;
        }
      }

      .text-box {
        margin: 15px 0 30px;
        height: 128px;
        overflow-y: scroll;
        border: 1px solid ${$BORDER_COLOR};
      }

      .styled-policy {
        margin-top: 10px;
      }
    }
  }
`;

export default PointRefundTabArea;
