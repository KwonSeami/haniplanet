import styled from "styled-components";
import {
  $BORDER_COLOR,
  $FONT_COLOR,
  $GRAY,
  $POINT_BLUE,
  $TEXT_GRAY,
  $WHITE
} from "../../../../styles/variables.types";
import {backgroundImgMixin, fontStyleMixin} from "../../../../styles/mixins.styles";
import * as React from "react";
import {staticUrl} from '../../../../src/constants/env';
import {isEmpty} from 'lodash';
import {ratingAverage, IAverage} from "@hanii/planet-rating";
import ModunawaSimpleStory from './ModunawaSimpleStory';
import ModunawaDetailStory from './ModunawaDetailStory';

const WrapperDiv = styled.div`
  position: relative;
  background-color: ${$WHITE};
  transition: 0.1s all;

  .story-list{
    position: relative;
    min-height: 70px;
    padding: 12px 0 12px;
    box-sizing: border-box;

    > p {
      ${fontStyleMixin({
        size: 16,
        weight: '600'
      })};

      span {
        display: inline-block;
        vertical-align: middle;
        width: 60px;
        height: 18px;
        margin: -2px 0 0 4px;
        padding-left: 5px;
        line-height: 1.35;
        border-radius: 9px;
        border: 1px solid ${$POINT_BLUE};
        box-sizing: border-box;
        ${fontStyleMixin({
            size: 11, 
            color: $POINT_BLUE
        })};
        ${backgroundImgMixin({
          img: staticUrl('/static/images/icon/icon-story-complete.png'),
          size: '8px 8px',
          position: 'right 4px top 3px'
        })};
      }
    }

    > .tag li {
      display: inline-block;
    
      p {
        margin-right: 6px;
        padding: 0;
      }
    }

    & div {
      position: absolute;
      top: 50%;
      right: 0;
      min-width: 76px;
      transform: translateY(-50%);
      transition: 0.1s all;

      li {
        position: relative;
        display: inline-block;
        margin-left: 9px;

        &:first-child {
          margin-right: 4px;
        }

        img {
          display: inline-block;
          vertical-align: middle; 
          width: 15px;
          height: 15px;
          margin-right: 2px;
        }

        p {
          display: inline-block;
          vertical-align: middle;
          margin-right: 3px;
          ${fontStyleMixin({
            size: 12, 
            color: '#999'
          })};
        }
        
        span {
          display: inline-block;
          vertical-align: middle;   
          ${fontStyleMixin({
            size: 13, 
            weight: '600',
            color: $FONT_COLOR,
            family: 'Montserrat'
          })};
        }
      }
    }

    li.total {
      width: 85px;
      margin-left: 33px;
      
      p {
        color: ${$TEXT_GRAY};
        margin-right: 10px;

        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: -9px;
          width: 1px;
          height: 8px;
          transform: translateY(-50%);
          background-color: ${$BORDER_COLOR};
        }
      }

      span {
        width: 53px;
        ${fontStyleMixin({
          size: 26,
          weight: '300',
          color: $POINT_BLUE,
        })};
      }
    }
  }

  > div > article {
    margin-bottom: 27px;
    border-left: 1px solid ${$BORDER_COLOR};
    border-right: 1px solid ${$BORDER_COLOR};

    .story-top {
      position: relative;
      padding: 21px 35px 25px;
      border-top: 1px solid ${$GRAY};
      box-sizing: border-box;

      > ul {
        width: 100%;

        > li {
          position: relative;
          width: 270px;
          height: 100%;
          display: inline-block;

          & + li {
          width: 36%;
          float: right;
          padding-top: 4px;
          
            &::before {
              content: '';
              position: absolute;
              top: 5%;
              left: -16px;
              width: 1px;
              height: 90%;
              border-right: 1px solid ${$BORDER_COLOR};
            }
          }

          > p {
            line-height: 30px;
            ${fontStyleMixin({
              size: 26,
              weight: '600'
            })};
          }
    
          .tag {
            li {
              p {
                margin-right: 6px;
                padding: 0;
                ${fontStyleMixin({
                  size: 14,
                  weight: 'normal'
                })};
              }
            }
          }

          .count {
            margin-top: 2px;

            li {
              display: inline-block;
              margin-right: 18px;

               p {
                 ${fontStyleMixin({
                  size: 12,
                  color: '#999'
                 })};

                 span {
                   ${fontStyleMixin({
                    size: 13,
                    color: $POINT_BLUE
                   })};
                 }
               }
            }
          }

          > div {
            a {
              img {
                width: 12px;
                height: 13px;
                margin-bottom: 2px;
                margin-right: 2px;
              }
  
              h3 {
                width: 143px;
                display: inline-block;
                ${fontStyleMixin({
                  size: 14,
                  weight: 'bold'
                })};
              }
            }

            p {
              margin-top: 9px;
              line-height: 21px;
              ${fontStyleMixin({
                size: 17,
                color: $FONT_COLOR
              })};

              small {
                ${fontStyleMixin({
                  size: 11,
                  color: $TEXT_GRAY
                })};
              }

              span {
                letter-spacing: -0.8px;
                ${fontStyleMixin({
                  color: $POINT_BLUE
                })};
              }
            }
          }
        }
      }

      .arrow-fold {
        position: absolute;
        top: 1px;
        right: 1px;
        width: 38px;
        height: 40px;
        background-color: #f9f9f9;

        img {
          width: 13px;
          height: 6px;
          padding-bottom: 4px;
        }
      }
    }

    .story-graph {
      position: relative;
      height: 392px;
      padding: 0 37px;
      border-bottom: 1px solid ${$GRAY};

      > div:first-of-type {
        width: 280px;
        padding: 57px 0 0;

        > p {
          ${fontStyleMixin({
            size: 26,
            weight: '600'
          })};
        }

        .tag {
          li {
            display: inline-block;

            p {
              margin-right: 6px;
              padding: 0;
              font-weight: 400;
            }
          }
        }

        .link {
          margin-top: 4px;

          img {
            vertical-align: -2px;
            width: 13px;
            height: 13px;
          }

          span {
            margin-left: 2px;
            color: #999;
            text-decoration: underline;
          }
        }
      }

      .gauge-warpper {
        position: absolute;
        bottom: 49px;
        left: calc(50% - 200px);
        width: 400px;

        ul.off li {
          span {
            color: ${$TEXT_GRAY};
          }
        }
        
        li {
          display: inline-block;
          width: 50%;

          img {
            vertical-align: middle;
            width: 15px;
            height: 15px;
            margin-right: 3px;
            padding-top: 3px;
          }

          p {
            display: inline-block;
            vertical-align: middle;
            padding-top: 3px;
            ${fontStyleMixin({
              size: 14,
              weight: '800'
            })};
            
            span {
              padding-left: 4px;
              ${fontStyleMixin({
                weight: '800',
                color: $POINT_BLUE
              })};
            }
          }

          & + li {
            text-align: right;
            
            p {
              display: inline-block;
              vertical-align: middle;
              ${fontStyleMixin({
                size: 12,
                weight: '600',
                color: $POINT_BLUE
              })};
            }

            span {
              vertical-align: middle;
              margin-left: 6px;
              ${fontStyleMixin({
                size: 39,
                weight: '300',
                color: $POINT_BLUE,
                family: 'Montserrat'
              })};
            }
          }
        }
      }

      .graph {
        position: absolute;
        top: 20px;
        right: calc(50% - 150px);
      }
    }

    .story-rating {

      div:first-child {
        padding: 7px 35px;
        background-color: #f4f9ff;
        border-bottom: 1px solid ${$BORDER_COLOR};

        p {
          display: inline-block;
          vertical-align: middle;
          ${fontStyleMixin({
            size: 16,
            weight: '600'
          })};
        }

        span {
          vertical-align: middle;
          margin-left: 5px;
          color: ${$GRAY};
        }
      }

      .rating-wrapper {
        position: relative;
        padding: 0 20px 7px;
        border-bottom: 1px solid ${$BORDER_COLOR};

        > ul:first-of-type {
          position: relative;
          padding: 12px 0 12px;
          border-bottom: 1px solid ${$BORDER_COLOR};

          &::after {
            content: '';
            position: absolute;
            top: 22px;
            left: 50%;
            width: 1px;
            height: calc(100% - 40px);
            border-right: 1px solid ${$BORDER_COLOR};
          }
          
          > li {
            display: inline-block;
            width: 50%;
            padding: 6px 0 6px 18px;
            box-sizing: border-box;

            &:nth-child(even) {
              padding-left: 25px;
            }

            > img {
              display: inline-block;
              vertical-align: middle;
              width: 15px;
              height: 15px;
            }

            p {
              display: inline-block;
              vertical-align: middle;
              min-width: 95px;
              margin-left: 7px;
              ${fontStyleMixin({
                size: 12,
                weight: 'bold'
              })};
            }
            
            ul {
              display: inline-block;
            }
          }
        }

        button {
          display: block;
          width: 180px;
          height: 39px;
          margin: 12px auto 25px;
          border-radius: 19.5px;
          background-color: #499aff;
          ${fontStyleMixin({
            size: 15,
            color: $WHITE
          })};
        }
      }
    }
    /* comment border */
    .comment-area {
      border-left-width: 0;
      border-right-width: 0;
    }
  }
`;

interface IStoryModunawaProps {
  extension: IAverage;
}

const StoryModunawa = React.memo<IStoryModunawaProps>(props => {
  const [on, setOn] = React.useState(false);
  const {extension} = props;
  const {price_comparisons} = extension || {} as any;

  const branch = React.useCallback(() => {
    return on
      ? ModunawaDetailStory
      : ModunawaSimpleStory;
  }, [on]);

  const totalAvg = React.useMemo(() => ratingAverage(extension), [extension]);
  const isMall = React.useMemo(() => price_comparisons && !isEmpty(price_comparisons), [price_comparisons]);

  const Branch = branch();

  return (
    <WrapperDiv onClick={() => !on && setOn(true)}>
      <Branch
        {...props}
        isMall={isMall}
        totalAvg={totalAvg}
        setToggle={setOn}
      />
    </WrapperDiv>
  );
});

export default StoryModunawa;

