import * as React from 'react';
import classNames from 'classnames';
import {Gauge} from '@hanii/planet-rating';
import {CircularGridLines, RadarChart} from 'react-vis';
import A from '../../UI/A';
import Rating from '../../Rating';
import ProfessorEvaluationPopup from '../../layout/popup/ProfessorEvaluationPopup';
import {staticUrl} from '../../../src/constants/env';
import {pushPopup} from '../../../src/reducers/popup';
import {makeFullEdgeRatingMap} from '../../../src/lib/rating';
import {updateStory} from '../../../src/reducers/orm/story/storyReducer';
import {$POINT_BLUE} from '../../../styles/variables.types';
import ProfessorApi from '../../../src/apis/ProfessorApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import { pickUserSelector } from '../../../src/reducers/orm/user/selector';

const mapMyRate = (myRate) => myRate.reduce((prev, {score, story_edge_id}) => {
  prev[story_edge_id] = score;
  return prev;
}, {});

const ModunawaEvaluation = ({
  id,
  url_card,
  extension,
  totalAvg,
}) => {
  // Props
  const {
    rating_count,
    ratings,
    my_rate,
  } = extension || {};

  // State
  const [edited, setEdited] = React.useState(false);
  const [edgeRatingMap, setEdgeRating] = React.useState({});

  // Api
  const professorApi: ProfessorApi = useCallAccessFunc(access => new ProfessorApi(access));

  // Redux
  const me = useSelector(
    ({orm, system: {session: {id}}}) => pickUserSelector(id)(orm),
    shallowEqual,
  );
  const {user_type} = me || {};
  const dispatch = useDispatch();

  React.useEffect(() => {
    my_rate && setEdgeRating(mapMyRate(my_rate));
  }, [my_rate]);

  return (
    <div>
      <div className="story-graph">
        <div>
          {url_card && (
            <div className="link">
              <img
                src={staticUrl('/static/images/icon/icon-story-homepage.png')}
                alt="homepage"
              />
              <A to={url_card.url} newTab>
                <span>{url_card.url}</span>
              </A>
            </div>

          )}
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
                backgroundColor: '#fff',
                color: '#fff',
              },
              axes: {
                line: {
                  backgroundColor: '#fff',
                  color: '#fff',
                },
                ticks: {
                  backgroundColor: '#fff',
                  color: '#fff',
                },
                text: {
                  opacity: 1,
                  backgroundColor: '#fff',
                  color: '#333',
                },
              },
              labels: {
                textAnchor: 'middle'
              }
            }}
            margin={{
              left: 50,
              top: 25,
              bottom: 20,
              right: 50
            }}
            colorType="#fff"
            tickFormat={() => ''}
            width={300}
            height={250}
          >
            <CircularGridLines
              tickValues={[1.2, ...new Array(5)].map((_, i) => i / 5 - 1)}
              color={0}
              width={200}
              height={200}
              style={{
                fill: '#fff',
                fillOpacity: 0,
                stroke: '#f0f0f0',
                axes: {
                  fill: '#fff',
                  fillOpacity: 0,
                  stroke: '#f0f0f0',
                  circle: {
                    fill: '#fff',
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
                className={classNames({disabled: !edited})}
                onClick={() => {
                  if (edited) {
                    const fullEdgeRatingMap = makeFullEdgeRatingMap(edgeRatingMap, ratings);

                    professorApi.patchRating(
                      id,
                      fullEdgeRatingMap
                    ).then(({status}) => {
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

                  professorApi.createRating(
                    id,
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
  );
};

export default React.memo(ModunawaEvaluation);