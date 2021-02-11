import * as React from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import BandCard from '../../../UI/Card/BandCard/BandCard';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';
import FeedApi from '../../../../src/apis/FeedApi';
import OnClassRecommendItem from './OnClassRecommendItem';
import Loading from '../../../common/Loading';
import NoContentText from '../../../NoContent/NoContentText';

const StyledBandCard = styled(BandCard)`
  position: relative;
  max-width: 680px;
  margin: auto;
  padding: 22px 0 24px;
  border: 0;
  box-sizing: border-box;

  > h2 {
    position: relative;
    padding: 0 0 10px 20px;
    ${fontStyleMixin({
      size: 16,
      weight: 'bold'
    })};
  }

  > ul {
    width: 100%;
    overflow: hidden;
    overflow-x: auto;
    white-space:nowrap;
  }

  @media screen and (min-width: 680px) {
    padding: 24px 0;

    > h2 {
      padding-left: 0;
    }
  }
`;

interface Props {
  className?: string;
  title: string;
}

const OnClassRecommendList: React.FC <Props> = (({
    className,
    title,
  }) => {
    const [resData, setResData] = React.useState([]);
    const [pending, setPending] = React.useState(true);
    // API
    const feedApi: FeedApi = useCallAccessFunc(access => access && new FeedApi(access));

    React.useEffect(() => {
      if (feedApi) {
        feedApi.onclass()
          .then(({status, data: {results}}) => {
            if (status === 200) {
              setPending(false);
              setResData(results);
            }
          });
      }
    }, []);

    if (pending) {
      return <Loading/>;
    }

    return (
      <StyledBandCard
        title={title}
        className={className}
      >
        {!isEmpty(resData)
          ? (
            <ul>
              {resData.map(({
                slug,
                story,
                oncoming_month,
                thumbnail = ''}) => (
                <OnClassRecommendItem
                  slug={slug}
                  story={story}
                  oncoming_month={oncoming_month}
                  thumbnail={thumbnail}
                />
              ))}
            </ul>
          ) : (
            <NoContentText alt="목록이 비었습니다.">
              <p>
                와 당신은 모든 강의를 마스터하셨군요!<br/>
                추천해 드릴 강의가 없네요!<br/>
                추천해 드릴 강의를 찾아올게요! 조금만 기다려주세요!
              </p>
            </NoContentText>
          )
        }

      </StyledBandCard>
    );
  }
);

export default React.memo(OnClassRecommendList);
