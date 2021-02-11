import styled from 'styled-components';
import {staticUrl} from '../../../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin} from '../../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY} from '../../../../styles/variables.types';

const MeetupMyActivityItem = styled.li`
  position: relative;
  border-bottom: 1px solid ${$BORDER_COLOR};
  overflow: hidden;
    
  > ul {
    display: flex;
    align-items: center;
    width: 100%;
    
    > li {
      position: relative;
      box-sizing: border-box;

      & ~ li{
        padding: 20px;

        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0px;
          transform: translateY(-50%);
          width: 1px;
          height: 80px;
          border-left: 1px solid #eee;
        }
      }

      &:last-child {
        width: 135px;
        padding-right: 0;
      }
    }

    .info-box {
      -ms-flex: 1 auto;
      flex: 1 0 0;
      padding: 24px 0;
      overflow: hidden;

      .user-wrapper {
        li {
          display: inline-block;
          vertical-align: middle;
          ${fontStyleMixin({
            size: 14,
            color: $TEXT_GRAY
          })};

          &:first-child::after {
            content: '';
            display: inline-block;
            vertical-align: middle;
            height: 6px;
            margin: 0 5px;
            border-left: 1px solid ${$BORDER_COLOR};
          }
        }
      }
      
      a {
        margin: 3px 0 2px;
  
        h3 {
          position: relative;
          display: inline-block;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          max-width: calc(100% - 30px);
          ${fontStyleMixin({
            size: 15,
            weight: '600',
            color: $FONT_COLOR
          })};
        }

        img {
          width: 19px;
          height: 19px;
          margin-top: 4px;
          vertical-align: bottom;
        }
      }
      
      .info {
        li {
          display: inline-block;
          vertical-align: middle;

          &.onclass-extension {
            img {
              margin: -1px 2px 0 0;
            }

            p {
              ${fontStyleMixin({
                size: 11,
                weight: '600',
                color: $POINT_BLUE
              })};
            }
          }

          &.stand-by {
            p {
              ${fontStyleMixin({
                size: 12,
                weight: 'bold',
                family: 'Montserrat',
                color: '#ecbb51',
              })};
    
              img {
                width: 16px;
                vertical-align: middle;
                margin: -2px 5px 0 3px;
              }
    
              span {
                ${fontStyleMixin({
                  size: 11,
                  color: $GRAY,
                })};
              }
            }
          }

          &.applied-state {
            img {
              vertical-align: middle;
              width: 14px;
              margin-right: 6px;
            }
      
            p {
              display: inline-block;
              vertical-align: middle;
              color: #999;
              font-family: 'Montserrat';
      
              span {
                ${fontStyleMixin({
                  color: $POINT_BLUE,
                  weight: '600',
                  family: 'Montserrat'
                })};

                &.off {
                  color: #999;
                }
              }
            }
      
            > span {
              display: inline-block;
              vertical-align: middle;
              margin-top: -1px;
              ${fontStyleMixin({
                size: 11,
                weight: 'bold',
                color: '#999',
              })};
      
              &::before {
                content: '';
                display: inline-block;
                vertical-align: middle;
                width: 2px;
                height: 2px;
                border-radius: 50%;
                background-color: #999;
                margin: -2px 5px 0;
              }
      
              &.on {
                color: ${$POINT_BLUE};
              }
            }
          }

          & ~ li {
            margin-left: 14px;

            p {
              font-family: 'Montserrat';
            }
          }

          img {
            display: inline-block;
            vertical-align: middle;
            width: 10px;
            height: 12px;
            margin-right: 5px;
          }

          p {
            display: inline-block;
            vertical-align: middle;
            ${fontStyleMixin({
              size: 11,
              color: $GRAY
            })};
          }
        }
      }
    }    
  }
  
  &.created-li {
    .info-box ~ li::before {
      height: 65px;
    }

    .applied-list {
      width: 155px;

      button {
        display: block;
        width: 135px;
        height: 35px;
        border: 1px solid ${$BORDER_COLOR};
        cursor: pointer;
        ${fontStyleMixin({
          size: 13,
          weight: '600'
        })};

        &[disabled] {
          background-color: #f4f4f4;
          opacity: 1;
          color: #999;
          border: 0;
        }
      }

      p {
        margin-top: 7px;
        ${fontStyleMixin({
          size: 13,
          weight: '600',
        })};

        img {
          width: 19px;
          vertical-align: bottom;
        }
      }
    }
  }

  &.applied-li {
    .created-date {
      width: 111px;
      text-align: center;

      p {
        ${fontStyleMixin({
          size: 13,
          color: $FONT_COLOR,
          family: 'Montserrat'
        })};
      }
    }

    .created-state {
      span {
        ${fontStyleMixin({
          size: 11,
          weight: 'bold',
          color: $POINT_BLUE
        })};

        &.refund {
          color: #f32b43;
        }
      }

      p {
        font-size: 14px;
        margin-top: 8px;
      }

      img {
        vertical-align: middle;
        width: 19px;
        height: 19px;
        margin-top: -2px;
      }
    }
  }

  &.followed-li {
    &:hover {
      .followed-state {
        width: 195px;
      }

      .followed-delete {
        right: 0;
        opacity: 1;
      }
    }

    .followed-state {
      transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
      
      > span {
        ${fontStyleMixin({
          size: 11,
          weight: 'bold',
          color: '#999'
        })};
        
        &.on {
          color: ${$POINT_BLUE};
        }
      }

      button {
        display: block;
        width: 115px;
        height: 35px;
        margin-top: 4px;
        padding-right: 8px;
        border: 1px solid ${$BORDER_COLOR};
        box-sizing: border-box;
        cursor: pointer;
        ${fontStyleMixin({
          size: 13,
          weight: '600'
        })};

        i {
          display: inline-block;
          vertical-align: middle;
          width: 17px;
          height: 17px;
          ${backgroundImgMixin({
            img: staticUrl('/static/images/icon/check/icon-check-basic.png'),
          })};
        }

        &[disabled] {
          color: ${$TEXT_GRAY};
          border-color: transparent;
          background-color: #f4f4f4;
          cursor: not-allowed;
          opacity: 1;

          i {
            opacity: 0.3;
          }
        }
      }

    }
  }

  &.my-class-li {
    .class-duration {
      width: 123px;

      p {
        ${fontStyleMixin({
          size: 16,
          weight: '600',
          family: 'Montserrat',
          color: $POINT_BLUE,
        })};

        span {
          font-weight: 600;
        }

        &.off {
          ${fontStyleMixin({
            size: 16,
            weight: 'normal',
            family: 'Noto Sans KR',
            color: '#999',
          })};
        }
      }
    }

    .class-state {
      width: 124px;

      p {
        ${fontStyleMixin({
          size: 14,
        })};

        img {
          width: 19px;
          vertical-align: top;
          margin-top: 1px;
        }
      }
    }
  }
  
  .followed-delete {
    position: absolute;
    top: 0;
    right: -40px;
    bottom: 0;
    width: 40px;
    background-color: #f9f9f9;
    transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    opacity: 0;
    cursor: pointer;

    img {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 18px;
      height: 18px;
      transform: translate(-50%, -50%);
    }
  }
`;

export default MeetupMyActivityItem;
