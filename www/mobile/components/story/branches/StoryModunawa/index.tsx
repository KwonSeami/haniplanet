import * as React from "react";
import Tag from "../../../UI/tag/Tag";
import styled from "styled-components";
import {
  $BORDER_COLOR,
  $FLASH_WHITE,
  $FONT_COLOR,
  $GRAY,
  $POINT_BLUE,
  $TEXT_GRAY,
  $WHITE
} from "../../../../styles/variables.types";
import {backgroundImgMixin, fontStyleMixin} from "../../../../styles/mixins.styles";
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
    padding: 12px 0 15px;
    border-top: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;

    > p {
      ${fontStyleMixin({
        size: 16,
        weight: '600'
      })};
    }

    .tag li {
      display: inline-block;

      p {
        margin-right: 6px;
        padding: 0;
      }
    }

    .count {
      margin-top: 2px;
      
      li {
        position: relative;
        display: inline-block;
        width: 70px;

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
  
    & div {
      position: absolute;
      top: 10px;
      right: 0;
      width: 92px;
      transition: 0.1s all;

      p {
        display: inline-block;
        vertical-align: middle;        
        ${fontStyleMixin({
          size: 12,
          color: $TEXT_GRAY
        })};

        &::after {
          content: '';
          display: inline-block;
          width: 1px;
          height: 8px;
          margin: 0 7px 0 6px;
          background-color: ${$BORDER_COLOR};
        }
      }

      span {
        vertical-align: middle;
        ${fontStyleMixin({
          size: 26,
          weight: '300',
          color: $POINT_BLUE,
          family: 'Montserrat'
        })};
      }

      @media screen and (max-width: 680px) {
        right: 15px;
      }
    }
    
    .completed {
      display: inline-block;
      position: absolute;
      bottom: 15px;
      right: 0;
      padding: 0 13px 0 5px;
      border-radius: 9px;
      border: 1px solid ${$POINT_BLUE};
      box-sizing: border-box;
      ${fontStyleMixin({
          size: 11, 
          color: $POINT_BLUE
      })};
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/check/icon-story-complete.png'),
        size: '8px 8px',
        position: 'right 4px center'
      })};

      @media screen and (max-width: 680px) {
        right: 15px;
      }
    }

    @media screen and (max-width: 680px) {
      padding: 12px 15px 15px;
    }
  }

  > div > article {
    margin-bottom: 11px;
    border-left: 1px solid ${$BORDER_COLOR};
    border-right: 1px solid ${$BORDER_COLOR};

    @media screen and (max-width: 680px) {
      border-width: 0;
    }

    > div:first-of-type {
      padding: 20px 14px 0;
      border-top: 1px solid ${$GRAY};

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

      .count {
        padding: 3px 0 23px;

        li {
          display: inline-block;

          p {
            ${fontStyleMixin({
              size: 12,
              color: $TEXT_GRAY
            })};

            span {
              margin: 0 10px 0 2px;
              ${fontStyleMixin({
                size: 13,
                color: $POINT_BLUE,
                weight: '600'
              })};
            }
          }
        }
      }

      div {
        border-top: 1px solid ${$BORDER_COLOR};
        padding: 12px 0;

        h3 {
          position: relative;
          display:inline-block;
          max-width:50%;
          padding-left:15px;
          
          img {
            position:absolute;
            left:0;
            top:50%;
            width: 13px;
            transform: translateY(-50%);
          }

          a {
            position: relative;
            display: inline-block;
            max-width:100%;
            vertical-align: middle;
            ${fontStyleMixin({
              size: 14,
              weight: 'bold'
            })};

            &:after {
              content: '';
              position: absolute;
              bottom: 2px;
              left: 0;
              width: 100%;
              height: 1px;
              background-color: ${$FONT_COLOR};
            }
          }
        }

        p {
          display: inline-block;
          float: right;
          max-width:50%;
          margin-top: -5px;
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
            margin-left: 4px;
            ${fontStyleMixin({
              size: 17,
              color: $POINT_BLUE
            })};
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

      .arrow-fold {
        position: absolute;
        top: 1px;
        right: 0;
        width: 40px;
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
      padding: 19px 0 43px;
      border-bottom: 1px solid ${$GRAY};
      
      .graph {
        margin: 10px auto 0;

        > div {
          margin: 0 auto;
        }
      }
      
      .gauge-warpper {
        position: relative;
        width: 80%;
        margin: 0 auto;

        ul.off li {
          span {
            color: ${$TEXT_GRAY};
          }
        }
        
        li {
          display: inline-block;
          width: 50%;

          img {
            width: 15px;
            height: 15px;
            vertical-align: middle;
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
              padding-bottom: 2px;
              ${fontStyleMixin({
                size: 12,
                weight: '600',
                color: $POINT_BLUE
              })};
            }
            span {
              vertical-align: middle;
              margin-left: 5px;
              ${fontStyleMixin({
                size: 35,
                weight: '300',
                color: $POINT_BLUE,
                family: 'Montserrat'
              })};
            }
          }
        }
      }
    }

    .story-rating {

      div:first-child {
        padding: 9px 15px 8px;
        background-color: #f4f9ff;
        border-bottom: 1px solid ${$BORDER_COLOR};

        p {
          display: inline-block;
          vertical-align: middle;
          ${fontStyleMixin({
            size: 14,
            weight: '600'
          })};
        }

        span {
          vertical-align:middle;
          margin-left: 5px;
          ${fontStyleMixin({
            size: 12,
            color: $GRAY
          })};
        }
      }

      .rating-wrapper {
        position: relative;
        padding: 0 0 10px;

        > ul:first-of-type {
          padding: 9px 15px 11px;
          border-bottom: 1px solid ${$BORDER_COLOR};
          
          > li {
            padding: 6px 0 4px;

            img {
              display: inline-block;
              vertical-align: middle;
              width: 15px;
              height: 15px;
            }

            p {
              display: inline-block;
              vertical-align: middle;
              margin-left: 8px;
              min-width: 88px;
              ${fontStyleMixin({
                size: 12,
                weight: 'bold'
              })};
            }
            
            ul {
              display: inline-block;

              li {
                display: inline-block;

                img {
                  width: 28px;
                  height: 28px;
                }
              }
            }
          }
        }

        button {
          display: block;
          width: 180px;
          height: 39px;
          margin: 15px auto 8px;
          color: ${$WHITE};
          border-radius: 19.5px;
          background-color: #499aff;
        }

        .tag{
          padding: 0 15px;
          li {
            display: inline-block;
          }
          p{
            padding: 5px 0 0;
          }
        }
      }
    }

    .story-comment{
      padding: 7px 15px 9px;
      border-top: 1px solid ${$BORDER_COLOR};
      border-bottom: 1px solid ${$BORDER_COLOR};

      img {
        display: inline-block;
        vertical-align: middle;
        width: 24px;
        height: 24px;
      }

      p {
        display: inline-block;
        vertical-align: middle;
        margin: 0 8px 0 3px;
        font-size: 13px;
      }

      span {
        vertical-align: middle;        
        ${fontStyleMixin({
          size: 17,
          family: 'Montserrat'
        })};
      }
    }
  }
  
    /* CommentArea */
    .comment-list {
      border-width: 0;
    }    

    .story-tab-wrapper {
      > ul {
        display: flex;
        li {
          flex: 1;
          padding: 8px 5px;
          text-align: center;
          box-sizing: border-box;
          border-top: 1px solid ${$BORDER_COLOR};
          border-bottom: 1px solid ${$BORDER_COLOR};

          & + li {
            border-left: 1px solid ${$BORDER_COLOR};
          }

          &.on {
            border-bottom-color: ${$FONT_COLOR};
          }

          &.only {
            text-align: left;

            &.on {
              border-bottom-color: ${$BORDER_COLOR};
            }
          }

          img {
            display: inline-block;
            vertical-align: middle;
            width: 24px;
            height: 24px;
          }

          p {
            display: inline-block;
            vertical-align: middle;
            margin: 0 3px 0 2px;
            font-size: 13px;
          }

          span {
            vertical-align: middle;        
            ${fontStyleMixin({
              size: 17,
              family: 'Montserrat'
            })};
          }
        }
      }
    }
  }

  .shop-contents {
    > ul {
      > li { 
        height: 85px;
        padding: 10px 15px 0;
        background-color: ${$FLASH_WHITE};
        border-bottom: 1px solid ${$BORDER_COLOR};
        box-sizing: border-box;

        ul {
          li {
            position: relative;
            display: inline-block;
            vertical-align: top;
            width: 50%;

            &:first-child {
              h4 {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                padding-top: 2px;
                ${fontStyleMixin({
                  size: 16,
                  weight: '600'
                })};
              }
              
              img {
                vertical-align: -6px;
                margin-right: 3px;
                width: 15px;
                height: 15px;
              }

              p {
                display: inline-block;
                vertical-align: middle;
                color: #999;
                margin-top: 3px;

                span {
                  margin: 3px 0 0 2px;
                  color: ${$FONT_COLOR};
                }
              }

              span {
                margin: 1px 0 0;
              }
            }

            &:last-child{
              text-align: right;
              
              p {
                font-size: 16px;

                span {
                  color: ${$POINT_BLUE};
                }
              }
            }
            
            > span {
              display: block;
              margin: 2px 0;
              ${fontStyleMixin({
                size: 11,
                color: $TEXT_GRAY
              })};
            }

            span.link {
              margin: 4px 0 0;
              color: ${$FONT_COLOR};
              text-decoration: underline;

              img {
                vertical-align: 1px;
                margin-left: 1px;
                width: 7px;
                height: 7px;
              }
            }
          }
        }
      }
    }
  }

  /* comment border */
  .comment-area {
    border-left-width: 0;
    border-right-width: 0;
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

