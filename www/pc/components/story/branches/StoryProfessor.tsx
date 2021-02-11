import * as React from "react";
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from "react-redux";
import {CircularGridLines, RadarChart} from 'react-vis';
import classNames from "classnames";
import queryString from "query-string";
import {ratingAverage, Gauge, IAverage} from "@hanii/planet-rating";
import styled from "styled-components";
import Rating from "../../Rating";
import WaterMark from "../../watermark";
import Tag from "../../UI/tag/Tag";
import {OverActionWrapper} from "../../UI/OverAction";
import {TabUl} from "../../UI/tab/TabUl";
import ProfessorEvaluationPopup from '../../layout/popup/ProfessorEvaluationPopup';
import FileCommentArea from '../../comment/FileCommentArea';
import DefaultCommentArea from "../../comment/DefaultCommentArea";
import RequestCommentArea from "../../comment/RequestCommentArea";
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY, $WHITE, $FONT_COLOR} from "../../../styles/variables.types";
import {fontStyleMixin,backgroundImgMixin,heightMixin} from "../../../styles/mixins.styles";
import {under} from "../../../src/lib/numbers";
import {staticUrl} from '../../../src/constants/env';
import {updateStory} from "../../../src/reducers/orm/story/storyReducer";
import {pickUserSelector} from "../../../src/reducers/orm/user/selector";
import {pushPopup} from "../../../src/reducers/popup";
import {makeFullEdgeRatingMap} from "../../../src/lib/rating";
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import ProfessorApi from '../../../src/apis/ProfessorApi';
import moment from 'moment';

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
      line-height: 24px;
    }

    .title {
      position: relative;
      vertical-align: middle;

      &.new {
        &::after {
          position: absolute;
          top: 3px;
          right: -5px;
          display: block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: ${$POINT_BLUE};
          content: '';
        }
      }
    }

    .icons {
      margin-left: 6px;
      font-size: 0;
      vertical-align: middle;

      i {
        display: inline-block;
        width: auto;
        min-width: 50px;
        ${heightMixin(18)};
        padding:0 9px;
        border-radius: 9px;
        box-sizing: border-box;
        font-size: 11px;
        font-style: normal;
        vertical-align: middle;

        & ~ i {
          margin-left: 2px;
        }
      }

      .icon-best {
        position: relative;
        padding-left: 18px;
        color: ${$WHITE};
        ${backgroundImgMixin({
          img: staticUrl('/static/images/icon/icon-medal-gold.png'),
          size: 'auto',
          position: '7px 50%'
        })};
        background-color: ${$POINT_BLUE};
        line-height: 18px;
        font-weight: 100;
        
        &.opacity {
          background-color: rgba(43, 137, 255, 0.8)
        }
        &.blur {
          background-color: rgba(43, 137, 255, 0.6)
        }
      }

      .icon-complete {
        padding: 0 13px 0 5px;
        border: 1px solid ${$POINT_BLUE};
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

    .tag li {
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
        width: 66px;

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
      margin-left: 16px;
      
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

    .graph-rating-wrapper {
      position:relative;

      .cover {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        width: 100%;
        height: 100%;
        background-color: ${$WHITE};
        opacity: 0.5;
      }

      .blind-popup {
        width: 210px;
        height: 80px;
        position: absolute;
        z-index: 10;
        top: calc(50% - 40px);
        left: calc(50% - 105px);
        display: block;
        background-color: ${$FONT_COLOR};
        border-radius: 10px;
        text-align: center;

        img {
          margin-top: 11px;
          width: 13px;
          height: 13px;
        }

        p {
          line-height: 17px;
          ${fontStyleMixin({
            size: 14,
            color: $WHITE
          })};
        }
      }

      .story-graph {
        position: relative;
        height: 291px;
        padding: 0 37px;
        border-top: 1px solid ${$GRAY};
        border-bottom: 1px solid ${$GRAY};

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

        > div:first-of-type {
          width: 280px;
          padding: 60px 0 40px;

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
        }

        .gauge-warpper {
          position: absolute;
          bottom: 82px;
          width: 250px;

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
          top: 10px;
          right: 40px;
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
          padding: 0 20px 0;

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

              >img {
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
            margin: 12px auto 5px;
            border-radius: 19.5px;
            background-color: #499aff;
            ${fontStyleMixin({
              size: 15,
              color: $WHITE
            })};
          }
        }
      }
    }

    & > .tag {
      margin: 0 0 7px 20px;

      li {
        display: inline-block;

        p {
          padding: 5px 0 0;
        }
      }
    }

    .story-comment{
      padding: 8px 15px;
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
    /* comment border */
    .comment-area {
      border-left-width: 0;
      border-right-width: 0;
    }
  }
`;

const NEWEST_STANDARD_DAY = 7;

const Simple = React.memo<any>((
  {
    index,
    title,
    tags,
    totalAvg,
    comment_count,
    extension: {my_rate, rating_count},
    created_at,
    router: {
      query: {order_by = ''}
    }
  }
) => {
  const createdDiffToday = moment().diff(created_at,'days', true);
  return (
    <OverActionWrapper>
      <div className="story-list">
        <p>
          <span 
            className={classNames('title', {
              new: createdDiffToday < NEWEST_STANDARD_DAY
            })}
          >
            {title}
          </span>
          <span className="icons">
            {(order_by === '-best_sum' && index < 5) && (
              <i 
                className={classNames('icon-best', {
                  opacity: index === 1,
                  blur: index > 1,
                })}
              >
                Best {index+1}
              </i>
            )}
            {my_rate && (
              <i className="icon-complete">평가완료</i>
            )}
          </span>
        </p>
        <ul className="tag">
          {tags && tags.map(({id, name, is_follow}) => (
            <li key={id}>
              <Tag
                id={id}
                name={name}
                highlighted={is_follow}
                is_follow={is_follow}
              />
            </li>
          ))}
        </ul>
        <div>
          <ul>
            <li>
              <img
                src={staticUrl('/static/images/icon/icon-story-face.png')}
                alt="참여"
              />
              <p>참여</p>
              <span>{under(rating_count, 99)}</span>
            </li>
            <li>
              <img
                src={staticUrl('/static/images/icon/icon-story-reply2.png')}
                alt="댓글"
              />
              <p>댓글</p>
              <span>{under(comment_count, 99)}</span>
            </li>
            <li className="total">
              <p>총점</p>
              <span>{totalAvg}</span>
            </li>
          </ul>
        </div>
      </div>
    </OverActionWrapper>
  )
});

const mapMyRate = (myRate) => myRate.reduce((prev, {score, story_edge_id}) => {
  prev[story_edge_id] = score;
  return prev;
}, {});

const Detail = React.memo<any>((
  {
    id,
    title,
    extension,
    totalAvg,
    tags,
    comment_count,
    can_comment,
    status,
    share_count,
    // injected
    setToggle,
    waterMarkProps
  }
) => {
  // Props
  const {
    rating_count,
    ratings,
    my_rate,
  } = extension || {};

  // Redux
  const {access, me} = useSelector(({orm, system: {session: {access, id}}}) => ({access, me: pickUserSelector(id)(orm)}));
  const {user_type} = me || {};
  const router = useRouter();
  const dispatch = useDispatch();
  const {q, order_by} = router.query;

  // State
  const [edgeRatingMap, setEdgeRating] = React.useState({});
  const [edited, setEdited] = React.useState(false);
  const [viewComment, setViewComment] = React.useState(true);
  const [tab, setTab] = React.useState<'comment' | 'request' | 'file'>('comment');

  const edges = (depth: number) => ratings.reduce((prev, {name}) => {
    prev[name] = depth;
    return prev;
  }, {});

  React.useEffect(() => {
    my_rate && setEdgeRating(mapMyRate(my_rate));
  }, [my_rate]);

  // 블라인드 boolean
  const isBlind = status === 'blinded';
  const professorApi: ProfessorApi = useCallAccessFunc(access => new ProfessorApi(access));

  return (
    <WaterMark {...waterMarkProps}>
      <article>
        <div className="graph-rating-wrapper">
          {isBlind && (
            <>
              <span className="cover" />
              <span className="blind-popup">
                <img
                  src={staticUrl('/static/images/icon/icon-professor-blind.png')}
                  alt="블라인드"
                />
                <p>
                  관리자에 의해<br/>
                  블라인드 처리된 글입니다.
                </p>
              </span>
            </>
          )}
          <div className="story-graph">
            <button
              type="button"
              className="arrow-fold"
              onClick={() => setToggle(false)}
            >
              <img
                src={staticUrl('/static/images/icon/arrow/icon-story-fold-arrow.png')}
                alt="접기"
              />
            </button>
            <div>
              <p>{title}</p>
              <ul className="tag">
                {tags && tags.map(({id, name, is_follow}) => (
                  <li key={id}>
                    <Tag
                      id={id}
                      name={name}
                      highlighted={is_follow}
                      onClick={() => router.push(`/professor?${queryString.stringify({
                        tag: name,
                        q,
                        order_by
                      })}`)}
                      is_follow
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="gauge-warpper">
              <ul className={classNames({off: rating_count === 0})}>
                <li>
                  <img
                    src={staticUrl('/static/images/icon/icon-story-face.png')}
                    alt="참여"
                  />
                  <p>
                    참여
                    <span>{rating_count}명</span>
                  </p>
                </li>
                <li>
                  <p>총점</p>
                  <span>{totalAvg}</span>
                </li>
              </ul>
              <Gauge
                height={3}
                max={10}
                curr={totalAvg}
                width={100}
              />
            </div>
          <div className="graph">
            <RadarChart
              animation
              colorRange={[$POINT_BLUE]}
              domains={ratings.map(({name}) => ({name, domain: [0, 10]}))}
              data={[ratings.reduce((prev, {name, sum_score}) => {
                prev[name] = sum_score / rating_count;
                return prev;
              }, {})]}
              style={{
                polygons: {
                  fillOpacity: 0.2,
                  strokeWidth: 0,
                  backgroundColor: $WHITE,
                  color: $WHITE,
                },
                axes: {
                  line: {
                    backgroundColor: $WHITE,
                    color: $WHITE,
                  },
                  ticks: {
                    backgroundColor: $WHITE,
                    color: $WHITE,
                  },
                  text: {
                    opacity: 1,
                    backgroundColor: $WHITE,
                    color: $WHITE,
                  },
                },
                labels: {
                  textAnchor: 'middle'
                }
              }}
              margin={{
                left: 60,
                top: 40,
                bottom: 35,
                right: 60
              }}
              colorType={$WHITE}
              tickFormat={t => ''}
              width={300}
              height={270}
            >
              <CircularGridLines
                tickValues={[1.2, ...new Array(5)].map((_, i) => i / 5 - 1)}
                color={0}
                width={200}
                height={200}
                style={{
                  fill: $WHITE,
                  fillOpacity: 0,
                  stroke: '#f0f0f0',
                  axes: {
                    fill: $WHITE,
                    fillOpacity: 0,
                    stroke: '#f0f0f0',
                    circle: {
                      fill: $WHITE,
                      fillOpacity: 0,
                      stroke: '#f0f0f0',
                    }
                  }
                }}
              />
            </RadarChart>
          </div>
        </div>
        {user_type === 'doctor' && (
          <div className="story-rating">
            <div>
              <p>
                평가하기
              </p>
              <span>별 1개당 2점으로, 0점~10점까지 평가 가능합니다. 익명으로 기록되며, 평가 완료 후 수정 가능합니다.</span>
            </div>
            <div className="rating-wrapper">
              <ul>
                {ratings.map(({id, name, avatar}) => (
                  <li key={id}>
                    {avatar && (
                      <img
                        src={avatar}
                        alt={name}
                      />
                    )}
                    <p>{name}</p>
                    <Rating
                      value={edgeRatingMap[id]}
                      onChange={count => {
                        setEdgeRating(curr => ({...curr, [id]: count}));
                        setEdited(true);
                      }}
                    />
                  </li>
                ))}
              </ul>
              {my_rate ? (
                <button
                  disabled={!edited}
                  onClick={() => {
                    if (edited) {
                      const fullEdgeRatingMap = makeFullEdgeRatingMap(edgeRatingMap, ratings);

                      professorApi.patchRating(id, fullEdgeRatingMap).then(({status, data}) => {
                        if (status === 200) {
                          dispatch(
                            updateStory(
                              id,
                              ({extension: {my_rate: _my_rate, ratings, ...extensionRest}, ...rest}) => {
                                const myOldRate = makeFullEdgeRatingMap(mapMyRate(_my_rate), ratings);
                                return {
                                  ...rest,
                                  extension: {
                                    ...extensionRest,
                                    my_rate: Object.keys(fullEdgeRatingMap).map((story_edge_id) => ({
                                      ...myOldRate[story_edge_id],
                                      story_edge_id,
                                      score: fullEdgeRatingMap[story_edge_id]
                                    })),
                                    ratings: ratings.map(({id, sum_score, ...rest}) => ({
                                      ...rest,
                                      id,
                                      sum_score: sum_score + fullEdgeRatingMap[id] - myOldRate[id]
                                    })),
                                  }
                                }
                              }
                            )
                          );
                          setEdited(false);
                        }
                      })
                    }
                  }}
                >
                  수정
                </button>
              ) : (
                <button
                  onClick={() => {
                    const fullEdgeRatingMap = makeFullEdgeRatingMap(edgeRatingMap, ratings);

                    professorApi.createRating(id, fullEdgeRatingMap).then(({status, data}) => {
                      if (status === 201) {
                        const {result: {my_rate}} = data;
                        dispatch(
                          updateStory(
                            id,
                            ({extension: {my_rate: _, rating_count, ratings, ...extensionRest}, ...rest}) => ({
                              ...rest,
                              extension: {
                                ...extensionRest,
                                my_rate,
                                rating_count: rating_count + 1,
                                ratings: ratings.map(({id, sum_score, rating_count: _rating_count, ...rest}) => ({
                                  ...rest,
                                  id,
                                  sum_score: sum_score + fullEdgeRatingMap[id],
                                  rating_count: (_rating_count || rating_count) + 1
                                })),
                              }
                            })
                          ),
                        );
                        dispatch(pushPopup(ProfessorEvaluationPopup));
                        setEdited(false);
                      }
                    })
                  }}
                >
                  등록
                </button>
              )}
            </div>
          </div>
        )}
        </div>
        <ul className="tag">
          {tags && tags.map(({id, name, is_follow}) => (
            <li key={id}>
              <Tag
                id={id}
                name={name}
                highlighted={is_follow}
                is_follow={is_follow}
                onClick={() => router.push(`/tag/${id}`)}
              />
            </li>
          ))}
        </ul>
        <TabUl>
          <li
            className={classNames({on: tab === 'comment'})}
            onClick={() => setTab('comment')}
          >
            <img
              src={staticUrl('/static/images/icon/icon-story-reply.png')}
              alt="댓글"
            />
            <p>댓글</p>
            <span>{under(comment_count)}</span>
          </li>
          <li className={classNames({on: tab === 'request'})} onClick={() => setTab('request')}>
            <img
              src={staticUrl('/static/images/icon/icon-story-request.png')}
              alt="요청"
            />
            <p>교수님 요청합니다</p>
          </li>
          <li className={classNames({on: tab === 'file'})} onClick={() => setTab('file')}>
            <img
              src={staticUrl('/static/images/icon/icon-story-file.png')}
              alt="요청"
            />
            <p>강의자료</p>
            <span>{under(share_count, 99)}</span>
          </li>
        </TabUl>
        {(can_comment && viewComment && tab === 'comment') && (
          <DefaultCommentArea
            targetPk={id}
            targetName="story"
            maxDepth={1}
            targetUserExposeType="anon"
          />
        )}
        {tab === 'request' && (
          <RequestCommentArea
            targetPk={id}
            targetName="story"
            maxDepth={0}
            targetUserExposeType="anon"
          />
        )}
        {tab === 'file' && (
          <FileCommentArea
            targetPk={id}
            targetUserExposeType="anon"
            hideWriter
          />
        )}
      </article>
    </WaterMark>
  );
});

interface IStoryProfessorProps {
  extension: IAverage;
}

const StoryProfessor = React.memo<IStoryProfessorProps>(props => {
  const [on, setOn] = React.useState(false);
  const {extension} = props;

  const branch = React.useCallback(() => {
    return on
      ? Detail
      : Simple;
  }, [on]);

  const totalAvg = React.useMemo( () => ratingAverage(extension), [extension]);

  const Branch = branch();

  return (
    <WrapperDiv onClick={() => !on && setOn(true)}>
      <Branch
        {...props}
        totalAvg={totalAvg}
        setToggle={setOn}
      />
    </WrapperDiv>
  );
});

export default StoryProfessor;