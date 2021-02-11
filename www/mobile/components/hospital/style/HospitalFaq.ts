import styled from 'styled-components';
import { fontStyleMixin, backgroundImgMixin } from '../../../styles/mixins.styles';
import { $FONT_COLOR, $TEXT_GRAY, $GRAY, $POINT_BLUE } from '../../../styles/variables.types';
import { stat } from 'fs';
import { staticUrl } from '../../../src/constants/env';

export const FaqWrapperDiv = styled.div`
  header {
    padding: 18px 15px;
    border-bottom: 8px solid #f6f7f9;

    & > * {
      display: inline-block;
      vertical-align: middle;
      line-height: 19px;
    }

    h3 {
      display: inline-block;
      ${fontStyleMixin({
        size: 16,
        color: $FONT_COLOR,
        family: 'Montserrat',
        weight: '600'
      })};
    }

    span {
      margin-left: 7px;
      ${fontStyleMixin({
        size: 11,
        color: $GRAY
      })}

      em {
        font-style: normal;
        color: ${$POINT_BLUE};
      }
    }

    p {
      float: right;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })}
    }
  }
`;

export const FaqListUl = styled.ul`
  li {
    padding: 15px;
    & ~ li {
      border-top: 1px solid #eee;
    }

    .profile {
      position: relative;
      margin-bottom: 19px;
      padding-left: 55px;

      .avatar {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }

      p {
        position: relative;
        line-height: 20px;
        ${fontStyleMixin({
          size: 16,
          color: $FONT_COLOR
        })};

        em {
          font-style: normal;
          color: ${$POINT_BLUE};
        }

        a {
          position: absolute;
          right: 0;
          top: 0;
          padding-right: 11px;
          text-decoration: underline;
          ${fontStyleMixin({
            size: 11,
            color: $TEXT_GRAY
          })}

          &::after {
            position: absolute;
            right: 0;
            top: 50%;
            width: 11px;
            height: 11px;
            transform: translateY(-50%);
            ${backgroundImgMixin({
              img: staticUrl('/static/images/icon/arrow/arrow-right-gray11x11.png'),
              size: '11px auto'
            })};
            content: '';
          }
        }
      }
      small {
        margin-top: 2px;
        line-height: 17px;
        ${fontStyleMixin({
          size: 11,
          color: '#999'
        })};
      }
    }
    .content {
      dt, dd {
        position: relative;
        padding-left: 37px;

        &::before {
          position: absolute;
          left: 0;
          top: 0;
          width: 30px;
          height: 21px;
          font-size: 0;
        }
      }
      dt {
        line-height: 22px;
        ${fontStyleMixin({
          size: 15,
          color: $FONT_COLOR
        })}

        em {
          font-weight: bold;
          font-style: normal;
        }

        &::before {
          ${backgroundImgMixin({
            img: staticUrl('/static/images/icon/icon-faq-question.png'),
            size: '100% auto'
          })};
          content: 'Q';
        }
      }
      dd {
        margin-top: 5px;
        line-height: 19px;
        ${fontStyleMixin({
          size: 13,
          color: '#999'
        })}
        &::before {
          ${backgroundImgMixin({
            img: staticUrl('/static/images/icon/icon-faq-answer.png'),
            size: '100% auto'
          })};
          content: 'A';
        }
      }
    }
  }
`;