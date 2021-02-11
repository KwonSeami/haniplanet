// 작업자: 임용빈
import * as React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import {useSelector, useDispatch} from 'react-redux';
import AdditionalContentItemMobile from '../AdditionalContentItem/AdditionalContentItemMobile';
import StyledUserFollowCardMobile from '../../../UI/Card/StyledUserFollowCardMobile';
import ReactCustomSlick from '../../../common/ReactCustomSlick';
import NoContent from '../../../NoContent/NoContent';
import FeedApi from '../../../../src/apis/FeedApi';
import {RootState} from '../../../../src/reducers';
import {staticUrl} from '../../../../src/constants/env';
import {userListSelector} from '../../../../src/reducers/orm/user/selector';
import {fetchUserListThunk} from '../../../../src/reducers/orm/user/thunks';
import {$GRAY} from '../../../../styles/variables.types';

const SLIDER_LENGTH = 4;

const Div = styled.div`
  position: relative;

  & > img {
    position: absolute;
    right: 0;
    top: 0;
    width: 54px;
  }
`;

const StyledSlider = styled(ReactCustomSlick)`
  .slick-list {
    height: 138px;

    .slick-slide {
      height: 138px;
      margin-right: 4px;
      box-sizing: border-box;
    }
  }
`;

const P = styled.p`
  padding: 5px 0 15px;
  font-size: 12px;
  line-height: 1.5;
  color: ${$GRAY};

  @media screen and (max-width: 500px) {
    span {
      display: block;
    }
  }
`;

const StyledNoContent = styled(NoContent)`
  height: 110px;
  padding: 0;
  text-align: center;
  font-size: 15px;
`;

interface Props {
  name: 'main' | 'mypage';
}

const slickSettings = {
  speed: 500,
  slidesToShow: SLIDER_LENGTH,
  slidesToScroll: SLIDER_LENGTH,
  swipe: true,
  arrows: false,
  variableWidth: true,
};

const RecommendUser: React.FC<Props> = React.memo(({name}) => {
  const sliderRef = React.useRef<Slider>();

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

  const DIFFERENT_TEXT_BY_NAME = {
    main: {
      title: `${users.length}명의 추천 회원`,
      noContentText: '아직 추천 회원이 없습니다.'
    },
    mypage: {
      title: '회원님을 위한 추천',
      noContentText: '아직 추천 회원이 없습니다.'
    }
  };

  return (
    <AdditionalContentItemMobile
      title={DIFFERENT_TEXT_BY_NAME[name].title}
      to="/user/recommend"
    >
      <P>
        회원님의 프로필 기준으로 추천됩니다.  
        <span> 팔로우 하면, 회원의 게시글을 볼 수 있습니다.</span>
      </P>
      <Div>
        {!!users.length ? (
          <>
            <StyledSlider
              ref={sliderRef}
              {...slickSettings}
            >
              {users.map(user => (
                <StyledUserFollowCardMobile
                  key={user.name}
                  hasFollowBtn
                  {...user}
                />
              ))}
            </StyledSlider>
            <img
              src={staticUrl('/static/images/icon/icon-line.png')}
              alt="슬라이드 미리보기"
            />
          </>
        ) : (
          <StyledNoContent
            backgroundImg={staticUrl('/static/images/banner/img-nocontent-friend.png')}
            text={
              <>
                회원님의 <span>프로필</span>을 완성해 보세요!
              </>
            }
          >
            {DIFFERENT_TEXT_BY_NAME[name].noContentText}
          </StyledNoContent>
        )}
      </Div>
    </AdditionalContentItemMobile>
  );
});

export default RecommendUser;
