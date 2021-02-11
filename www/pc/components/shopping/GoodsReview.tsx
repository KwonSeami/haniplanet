import * as React from 'react';
import CommentArea from '../comment/DefaultCommentArea';
import {ReviewWrapperDiv} from '../shopping/style/detial';
import {$POINT_BLUE,$WHITE} from '../../styles/variables.types';
import {CircularGridLines, RadarChart} from 'react-vis';
import {Gauge} from "@hanii/planet-rating";

const GoodsReview = ({
    id
  }) => {
    const rating_count = 1;
    const ratings = [
      { 
        "id": 796, 
        "name": "배송비", 
        "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/rating_edges/9c1f3580-1454-4969-85a6-b0415478f8e6.png", 
        "sum_score": 8, 
        "rating_count": 1 
      }, 
      { 
        "id": 797, 
        "name": "가격", 
        "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/rating_edges/56240d2e-02e8-4e17-a613-98f7ebbb14ba.png", 
        "sum_score": 8, 
        "rating_count": 1 
      }, 
      { 
        "id": 798, 
        "name": "품질", 
        "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/rating_edges/1938137b-dad7-4039-aca8-8ed03dbc7747.png", 
        "sum_score": 8, 
        "rating_count": 1 
      }, 
      { 
        "id": 2293, 
        "name": "가성비", 
        "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/rating_edges/1f0ce398-456e-442d-bf38-10992d1be0c5.png", 
        "sum_score": 8, 
        "rating_count": 1 
      }, 
      { 
        "id": 2294, 
        "name": "맛", 
        "avatar": "https://s3.ap-northeast-2.amazonaws.com/hani-public-stage/rating_edges/266b4f26-6a98-4a2f-8981-ce8488386423.png", 
        "sum_score": 8, 
        "rating_count": 1 
      }, 
    ];
  
    return (
      <ReviewWrapperDiv>
        <article>
          <div className="gauge-average">
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
                <span>{8.5}</span>
              </li>
            </ul>
            <Gauge
              max={10}
              curr={8.5}
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
          <div className="gauge-detail">
            <dl>
              <dt>배송비</dt>
              <dd>
                <Gauge
                  max={10}
                  curr={8.5}
                  width={100}
                />
              </dd>
            </dl>
            <dl>
              <dt>가성비</dt>
              <dd>
                <Gauge
                  max={10}
                  curr={4}
                  width={100}
                />
              </dd>
            </dl>
            <dl>
              <dt>품질</dt>
              <dd>
                <Gauge
                  max={10}
                  curr={9}
                  width={100}
                />
              </dd>
            </dl>
            <dl>
              <dt>맛</dt>
              <dd>
                <Gauge
                  max={10}
                  curr={10}
                  width={100}
                />
              </dd>
            </dl>
          </div>
        </article>
        <CommentArea
          targetPk={id}
          targetName="shopping"
          maxDepth={0}
          targetUserExposeType="real"
        />
      </ReviewWrapperDiv>
    )
  };

  GoodsReview.displayName = 'GoodsReview';
  export default React.memo(GoodsReview);