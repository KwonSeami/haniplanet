import styled from "styled-components";
import {$WHITE, $GRAY, $BORDER_COLOR, $FONT_COLOR} from "../../../styles/variables.types";
import {fontStyleMixin} from "../../../styles/mixins.styles";

const AssociatedCardWrapper = styled.div`
  position: relative;
  width: 900px;
  margin: auto;
  padding: 79px 38px 38px;
  box-sizing: border-box;
  background-color: ${$WHITE};

  h2 {
    padding-bottom: 63px;
    border-bottom: 1px solid #bdbdbd;
    text-align: center;
    ${fontStyleMixin({
      size: 36,
    })};

    p {
      margin-bottom: 4px;
      ${fontStyleMixin({
        size: 20,
        weight: '300',
      })};
    }
  }

  .card-info {
    display: flex;
    padding: 57px 30px 62px;

    .shinhancard-img-wrapper {
      width: 359px;
    }

    .info-text {
      padding-left: 36px;

      span {
        ${fontStyleMixin({
          size: 18,
          weight: 'bold',
          color: '#6788ab',
        })};
      }
  
      strong {
        display: block;
        margin-top: -4px;
        ${fontStyleMixin({
          size: 26,
          weight: 'bold',
        })};
      }
  
      p {
        margin-top: 10px;
        ${fontStyleMixin({
          size: 18,
        })};
      }
  
      ul {
        margin-top: 6px;

        li {
          position: relative;
          padding-left: 12px;
          ${fontStyleMixin({
            size: 14,
            color: $GRAY,
          })};
  
          &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #d7d7d7;
          }
        }
      }

      .button {
        margin-top: 14px;

        img {
          width: 14px;
          margin: 4px 0 0 2px;
          vertical-align: top;
        }
      }
    }
  }

  .associated-notice {
    margin-top: 24px;
    padding: 19px 27px 22px;
    border: 1px solid ${$BORDER_COLOR};
    border-top-color: ${$FONT_COLOR};
    box-sizing: border-box;

    > p {
      ${fontStyleMixin({
        size: 18,
        weight: 'bold',
        color: $GRAY,
      })};
    }

    .associated-notice-top {
      padding: 13px 0 17px;
      border-bottom: 1px solid ${$BORDER_COLOR};
      box-sizing: border-box;

      li {
        ${fontStyleMixin({
          size: 14,
          color: $GRAY,
        })};

        p {
          margin: 4px 0;
          padding-left: 6px;
          ${fontStyleMixin({
            size: 14,
            color: $GRAY,
          })};
        }

        span {
          padding-left: 12px;
          ${fontStyleMixin({
            size: 14,
            color: $GRAY,
          })};
        }

        ~ li {
          margin-top: 3px;
        }
      }
    }

    .associated-notice-bottom {
      padding-top: 18px;
      box-sizing: border-box;

      li {
        line-height: 24px;
        ${fontStyleMixin({
          size: 14,
          weight: 'bold',
        })};

        p {
          padding-left: 7px;
          ${fontStyleMixin({
            size: 14,
            weight: 'bold',
          })};
        }
      }
    }
  }
`;

export default AssociatedCardWrapper;