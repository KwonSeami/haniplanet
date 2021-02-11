import * as React from "react";
import Tag from "../../UI/tag/Tag";
import styled from "styled-components";
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY, $WHITE, $FONT_COLOR} from "../../../styles/variables.types";
import {fontStyleMixin, backgroundImgMixin, heightMixin} from "../../../styles/mixins.styles";
import {BASE_URL, staticUrl} from '../../../src/constants/env';
import {useDispatch, useSelector} from "react-redux";
import {numberWithCommas, under} from "../../../src/lib/numbers";
import classNames from "classnames";
import Rating from "../../Rating";
import queryString from "query-string";
import {axiosInstance} from "@hanii/planet-apis";
import {updateStory} from "../../../src/reducers/orm/story/storyReducer";
import {CircularGridLines, RadarChart} from 'react-vis';
import {pickUserSelector} from "../../../src/reducers/orm/user/selector";
import WaterMark from "../../watermark";
import {pushPopup} from '../../../src/reducers/popup';
import ProfessorEvaluationPopup from "../../layout/popup/ProfessorEvaluationPopup";
import {makeFullEdgeRatingMap} from "../../../src/lib/rating";
import {ratingAverage, Gauge, IAverage} from '@hanii/planet-rating';
import {HashId} from "../../../../../packages/types";
import {TabUl} from "../../UI/tab/TabUl";
import DefaultCommentArea from "../../comment/DefaultCommentArea";
import RequestCommentArea from "../../comment/RequestCommentArea";
import FileCommentArea from "../../comment/FileCommentArea";
import {useRouter} from 'next/router';
import moment from "moment";

interface DetailProps {
  index: number;
  id: HashId;
  title: string;
  totalAvg: number;
  tags: Array<{
    id: HashId;
    name: string;
    is_follow: boolean;
  }>;
  comment_count: number;
  can_comment: boolean;
  status: string;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  waterMarkProps: object;
  created_at: string;
  extension: {
    my_rate: object;
    rating_count: number;
  };
  router: {
    query: {order_by: string};
  }
}

const mapMyRate = (myRate) => myRate.reduce((prev, {score, story_edge_id}) => {
  prev[story_edge_id] = score;
  return prev;
}, {});

const NEWEST_STANDARD_DAY = 7;

const Simple = React.memo<DetailProps>((
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
              is_follow={is_follow}
              name={name}
              highlighted={is_follow}
            />
          </li>
        ))}
      </ul>
      <ul className="count">
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
      </ul>
      <div>
        <p>총점</p>
        <span>{totalAvg}</span>
      </div>
      {my_rate && (
        <span className="completed">평가완료</span>
      )}
    </div>
  )
});

const Detail = React.memo<DetailProps>((
  {
    id,
    title,
    extension,
    totalAvg,
    tags,
    comment_count,
    can_comment,
    share_count,
    status,
    // injected
    setToggle,
    waterMarkProps,
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
  const dispatch = useDispatch();
  const router = useRouter();
  // State
  const [edgeRatingMap, setEdgeRating] = React.useState({});
  const [edited, setEdited] = React.useState(false);
  const [viewComment, setViewComment] = React.useState(true);
  const {q, order_by} = router.query;
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
                  당사자에 의해<br/>
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
                    />
                  </li>
                ))}
              </ul>
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
                      color: $FONT_COLOR,
                    },
                  },
                  labels: {
                    textAnchor: 'middle',
                  }
                }}
                margin={{
                  left: 40,
                  top: 25,
                  bottom: 25,
                  right: 40
                }}
                colorType={$WHITE}
                tickFormat={t => ''}
                width={280}
                height={280}
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
            <div className="gauge-warpper">
              <ul className={classNames({off: rating_count === 0})}>
                <li>
                  <img
                    src={staticUrl('/static/images/icon/icon-story-face.png')}
                    alt="참여"
                  />
                  <p>
                    참여
                    <span>{numberWithCommas(rating_count)}명</span>
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

                        axiosInstance({token: access, baseURL: BASE_URL}).patch(
                          `/professor/${id}/rating/`,
                          fullEdgeRatingMap
                        ).then(({status, data}) => {
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

                      axiosInstance({token: access, baseURL: BASE_URL}).post(
                        `/professor/${id}/rating/`,
                        fullEdgeRatingMap
                      ).then(({status, data}) => {
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
                            )
                          );
                          setEdgeRating(mapMyRate(my_rate));
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
                name={name}
                highlighted={is_follow}
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
            <p>교수님 요청</p>
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
            targetName="story"
            maxDepth={0}
            targetUserExposeType="anon"
          />
        )}
      </article>
    </WaterMark>
  );
});

const WrapperDiv = styled.div`
  position: relative;
  background-color: ${$WHITE};
  transition: 0.1s all;

  .story-list{
    position: relative;
    padding: 12px 0 15px;
    border-top: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;

    @media screen and (max-width: 680px) {
      padding: 12px 15px 15px;
    }

    > p {
      ${fontStyleMixin({
        size: 16,
        weight: '600'
      })};
      line-height: 24px;

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
            size: '10px auto',
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
            img: staticUrl('/static/images/icon/check/icon-story-complete.png'),
            size: '8px 8px',
            position: 'right 4px top 3px'
          })};
        }
      }
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

      @media screen and (max-width: 680px) {
        right: 15px;
      }

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
  }

  > div > article {
    margin-bottom: 11px;
    border-left: 1px solid ${$BORDER_COLOR}; 
    border-right: 1px solid ${$BORDER_COLOR}; 

    @media screen and (max-width: 680px) {
      border-width: 0;
    }

    .graph-rating-wrapper {
      position: relative;

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
        z-index: 20;
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
        padding: 19px 0 43px;
        border-top: 1px solid ${$GRAY};
        border-bottom: 1px solid ${$GRAY};

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

        > div:first-of-type {
          padding: 0 15px 0;

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
        
        .graph {
          width: 80%;
          margin: 10px auto 0;

          >div {
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
          padding: 0;

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
        }
      }
    }

    & > .tag {
      margin: 0 0 10px 15px;
      li {
        display: inline-block;
      }
      p {
        padding: 5px 0 0;
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

    /* comment border */
    .comment-area {
      border-left-width: 0;
      border-right-width: 0;
    }
  }
`;

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

  const totalAvg = React.useMemo(() => ratingAverage(extension), [extension]);

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
