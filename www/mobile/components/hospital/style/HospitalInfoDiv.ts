import styled from "styled-components";
import {WorkInfoDiv} from '../../profile/form/ProfileJobForm';
import {fontStyleMixin, heightMixin, radiusMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE, $TEXT_GRAY, $WHITE} from '../../../styles/variables.types';

const HospitalInfoDiv = styled.div`
  position: relative;
  background-color: ${$WHITE};
  max-width: 680px;
  margin: auto;

  .hospital-delete-btn {
    position: absolute;
    top: 13px;
    right: 15px;

    img {
      width: 15px;
      vertical-align: middle;
      margin-right: 1px;
    }
  }

  > div {
    position: relative;
    border-bottom: 8px solid #f6f7f9;
    border-top: 1px solid #eee;
    box-sizing: border-box;

    &:first-child {
      border-top: none;
    }

    &.medical-team {
      > h2 {
        border-bottom: none;
      }
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: #eee;
    }

    > h2 {
      ${heightMixin(54)};
      padding-left: 15px;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;
      ${fontStyleMixin({
        size: 14,
        weight: 'bold',
        color: $FONT_COLOR
      })};

      span {
        ${fontStyleMixin({
          size: 14,
          weight: '300',
          family: 'Montserrat',
          color: $POINT_BLUE
        })};

        &.fold-btn {
          display: inline-block;
          float: right;
          margin-right: 15px;
          vertical-align: middle;

          &.toggle {
            img {
              transform: rotate(180deg);
            }
          }

          img {
            width: 15px;
          }
        }
      }
    }

    .hospital-images {
      width: 100%;

      > div {
        position: relative;
        width: 100%;
        height: 240px;
        padding: 13px 15px 14px;
        background-color: #f9f9f9;
        border-bottom: 1px solid #eee;
        box-sizing: border-box;

        > img {
          display: block;
          width: 52px;
          margin: auto;
          padding-top: 51px;
        }

        > p {
          padding-top: 2px;
          text-align: center;
          ${fontStyleMixin({
            size: 14,
            color: $TEXT_GRAY
          })};
        }

        > button {
          position: absolute;
          bottom: 20px;
          left: 15px;

          img {
            width: 13px;
            transform: rotate(90deg);
          }
        }

        > span {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 40px;
          ${heightMixin(23)};
          background-color: #000;
          text-align: center;
          ${fontStyleMixin({
            size: 10,
            // weight: '600',
            family: 'Montserrat',
            color: $WHITE
          })};
        }
      }

      > p {
        padding: 11px 15px 0;
        line-height: 17px;
        ${fontStyleMixin({
          size: 10,
          color: $TEXT_GRAY
        })};
      }
    }

    > ul {
      padding: 30px 15px 0;

      > li {
        margin-bottom: 21px;

        > h3 {
          position: relative;
          ${fontStyleMixin({
            size: 11,
            weight: 'bold'
          })};

          &.required::after {
            content: '*';
            display: inline-block;
            vertical-align: top;
            margin-left: 2px;
            ${fontStyleMixin({
              size: 11,
              weight: 'bold',
              color: '#f32b43'
            })};
          }

          span {
            position: absolute;
            top: 0;
            margin-left: 15px;
            ${fontStyleMixin({
              size: 11,
              color: $POINT_BLUE
            })};
          }
        }

        .tag-list {
          margin: 4px 0 0 -2px;
        }
        
        .tag-input input {
          font-size: 15px;

          &::placeholder {
            color: ${$TEXT_GRAY};
          }
        }

        .address-box {
          padding-bottom: 10px;
        }

        ul.hospital-category {
          position: relative;
          margin: 8px 0 0 -1px;

          > li {
            position: relative;
            display: inline-block;
            width: 64px;
            ${heightMixin(64)};
            margin: 1px;
            border: 1px dashed ${$BORDER_COLOR};
            border-radius: 10px;
            box-sizing: border-box;
            text-align: center;
            vertical-align: top;
            

            &.on {
              line-height: 14px;
              padding-top: 4px;
              ${radiusMixin('10px', '#eee')};

              > img {
                width: 36px;
              }

              button {
                position: absolute;
                top: -1px;
                right: -1px;
              }
            }

            > img {
              width: 12px;
            }

            p {
              ${fontStyleMixin({
                size: 10,
                color: '#999'
              })};
            }

            button {
              width: 15px;
              height: 15px;
            }
          }
        }

        .medical-field-wrapper {
          margin-top: 15px;
          padding-bottom: 20px;

          &::before {
            content: '';
            position: absolute;
            z-index: -1;
            top: 0;
            left: -15px;
            width: calc(100% + 30px);
            height: 100%;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
            box-sizing: border-box;
            background-color: #f9f9f9;
          }

          > div {
            > h3 {
              ${fontStyleMixin({
                size: 12,
                weight: 'bold',
                color: $FONT_COLOR
              })};
  
              span {
                ${fontStyleMixin({
                  size: 12,
                  weight: 'bold',
                  color: $POINT_BLUE
                })};
              }
  
              small {
                margin-left: 10px;
                ${fontStyleMixin({
                  size: 10,
                  color: $TEXT_GRAY
                })};
              }
            }
          }
        }

        .availability {
          padding: 11px 0 5px;

          li {
            display: inline-block;
            vertical-align: middle;
            margin-right: 30px;

            label {
              font-size: 15px;
              padding-left: 25px;
            }

            span {
              top: 2px;
            }
          }
        }

        .representative-image-list {
          padding-top: 10px;

          li {
            position: relative;
            display: inline-block;
            vertical-align: middle;
            margin-right: 6px;
            width: 105px;
            height: 75px;
            box-sizing: border-box;
            border-radius: 2px;
            border: 1px solid ${$BORDER_COLOR};
            text-align: center;
            

            img {
              width: 22px;
              padding-top: 25px;
            }
          }
        }

        > p {
          padding-top: 9px;
          ${fontStyleMixin({
            size: 11,
            color: $TEXT_GRAY
          })};

          span {
            color: ${$POINT_BLUE};
          }
        }

        .hospital-date {
          margin-top: 1px;

          li {
            display: inline-block;
            vertical-align: middle;
            padding-right: 7px;

            &:last-child {
              padding-right: 0;
            }
          }
        } 

        .hospital-time {
          margin-top: 12px;

          table {
            border-collapse: separate;
            border-spacing: 6px;
            margin-left: -6px;

            tr {
              position: relative;
  
              th {
                width: 41px;
                ${heightMixin(40)};
              }
  
              td {
                padding: 0;
                height: 40px;

                &:first-of-type {
                  padding-left: 9px;
                }

                input {
                  border-bottom: 1px solid ${$BORDER_COLOR} !important;
                }
              }

              .line {
                width: 8px;
              }
            }
          }
        }
      }
    }

    ${WorkInfoDiv} {
      margin-top: 0;
      padding: 0 15px;
      margin-bottom: -8px;

      .button-group {
        margin-bottom: 0;
      }
    }
  }
`;

export default HospitalInfoDiv;