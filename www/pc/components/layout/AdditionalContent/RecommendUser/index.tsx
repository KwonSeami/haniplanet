// 작업자: 임용빈
import * as React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import AdditionalContentItemPC from '../AdditionalContentItem/AdditionalContentItemPC';
import NoContent from '../../../NoContent/NoContent';
import SimplePaginator from '../../../UI/paginator/SimplePaginator';
import UserFollowCard from '../../../UI/Card/UserFollowCard';
import {$GRAY} from '../../../../styles/variables.types';
import {staticUrl} from '../../../../src/constants/env';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {useDispatch, useSelector} from 'react-redux';
import {userListSelector} from '../../../../src/reducers/orm/user/selector';
import {fetchUserListThunk} from '../../../../src/reducers/orm/user/thunks';
import {RootState} from '../../../../src/reducers';
import FeedApi from '../../../../src/apis/FeedApi';
import ReactCustomSlick from '../../../common/ReactCustomSlick';

const SLIDER_LENGTH = 3;

const StyledSlider = styled(ReactCustomSlick)`
  .slick-list {
    height: 110px;
    
    .slick-slide {
      height: 110px;
      margin-right: 5px;
      box-sizing: border-box;
    }
  }
`;

const P = styled.p`
  padding: 5px 0 15px;
  font-size: 12px;
  line-height: 1.5;
  color: ${$GRAY};
`;

const StyledSimplePaginator = styled(SimplePaginator)`
  position: relative;
  padding-top: 10px;

  button {
    position: absolute;
    left: 0;
    top: 10px;

    &:last-child {
      left: auto;
      right: 0;
    }

    img {
      width: 20px;
    }
  }

  p {
    text-align: center;
    ${fontStyleMixin({
      family: 'Montserrat',
      weight: '600'
    })}
    letter-spacing: 0;
  }
`;

interface Props {
  name: 'main' | 'mypage';
}

const RecommendUser: React.FC<Props> = React.memo(({name}) => {
  const sliderRef = React.useRef<Slider>();
  // State
  const [currIdx, setCurrIdx] = React.useState(0);

  // Redux
  const dispatch = useDispatch();
  const {users, system: {session: {access}}} = useSelector(({orm, system}: RootState) => ({
    users: userListSelector('recommend')(orm)[0],
    system
  }));

  // Fetch Data
  React.useEffect(() => {
    dispatch(fetchUserListThunk({
      listKey: 'recommend',
      api: new FeedApi(access).user()
    }));
  }, [access]);

  const slickSettings = {
    speed: 500,
    slidesToShow: SLIDER_LENGTH,
    slidesToScroll: SLIDER_LENGTH,
    swipe: true,
    variableWidth: true,
    beforeChange: (_, next: number) => setCurrIdx(next / SLIDER_LENGTH)
  };

  const DIFFERENT_TEXT_BY_NAME = {
    main: {
      title: `${users.length}명의 추천 회원`,
      noContentText: '아직 추천 회원이 없습니다.'
    },
    mypage: {
      title: `${users.length}명의 추천 회원`,
      noContentText: '아직 추천 회원이 없습니다.'
    }
  };

  return (
    <AdditionalContentItemPC
      title={DIFFERENT_TEXT_BY_NAME[name].title}
      to="/user/recommend"
    >
      <P>
        회원님의 프로필 기준으로 추천됩니다.<br />
        팔로우 하면, 회원의 게시글을 볼 수 있습니다.
      </P>
      {!!users.length ? (
        <>
          <StyledSlider
            ref={sliderRef}
            {...slickSettings}
          >
            {users.map(user => (
              <UserFollowCard
                key={user.name}
                hasFollowBtn
                {...user}
              />
            ))}
          </StyledSlider>
          <StyledSimplePaginator
            currentPage={currIdx + 1}
            lastPage={Math.ceil(users.length / SLIDER_LENGTH)}
            prevClickEvent={() => sliderRef.current.slickPrev()}
            nextClickEvent={() => sliderRef.current.slickNext()}
          />
        </>
      ) : (
        <NoContent
          backgroundImg={staticUrl('/static/images/banner/img-nocontent-friend.png')}
          text={
            <>
              회원님의 <span>프로필</span>을 완성해 보세요!
            </>
          }
        >
          {DIFFERENT_TEXT_BY_NAME[name].noContentText}
        </NoContent>
      )}
  </AdditionalContentItemPC>
  );
});

export default RecommendUser;
