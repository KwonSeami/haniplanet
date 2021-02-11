import * as React from 'react';
import AdditionalContentItemPC from '../AdditionalContentItem/AdditionalContentItemPC';
import styled from 'styled-components';
import {staticUrl} from '../../../../src/constants/env';
import isEmpty from 'lodash/isEmpty';
import NoContent from '../../../NoContent/NoContent';
import {useDispatch, useSelector} from 'react-redux';
import {fetchMemberThunk} from '../../../../src/reducers/orm/member/thunks';
import {memberListSelector} from '../../../../src/reducers/orm/member/selector';
import ReactCustomSlick from '../../../common/ReactCustomSlick';
import UserFollowCardBox from '../../../UI/Card/UserFollowCard/style/UserFollowCardBox';
import {$GRAY} from '../../../../styles/variables.types';
import {pushPopup} from '../../../../src/reducers/popup';
import MoaMemberPopup from '../../../moa/MoaMemberPopup';
import useBandMember from '../../../../src/hooks/band/useBandMember';

const SLIDER_LENGTH = 3;

const StyledAddtionalContentItemPC = styled(AdditionalContentItemPC)`
  padding-bottom: 30px;
  
  h2 {
    padding-bottom: 16px;
  }
`;

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

const UserFollowCardLink = styled.a`
  width: 100px;
  height: 110px;
`;

interface Props {
  slug: string;
}

const slickSettings = {
  speed: 500,
  slidesToShow: SLIDER_LENGTH,
  slidesToScroll: SLIDER_LENGTH,
  swipe: true,
  variableWidth: true,
  // beforeChange: (_, next: number) => setCurrIdx(next / SLIDER_LENGTH)
};

const MoaRecentlyJoinedMemberPC = React.memo<Props>(({slug}) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchMemberThunk({
      slug,
      sort: 'joined',
      status: 'active',
      option: {order_by: '-created_at'}
    }));
  }, [slug]);

  const {member: [members]} = useSelector(({orm}) => ({
    member: memberListSelector(`${slug}_joined`)(orm),
  }));

  const {
    withdrawMember,
    band
  } = useBandMember(slug);

  const {
    user_expose_type,
  } = band;

  return (
    <StyledAddtionalContentItemPC
      title="최근 가입 회원"
      to={`/band/${slug}/member`}
    >
      {!isEmpty(members) ? (
        <StyledSlider {...slickSettings}>
          {members.map(data => (
            <UserFollowCardLink>
              <UserFollowCardBox
                avatar={data.user.avatar}
                backgroundColor={$GRAY}
                key={data.id}
                onClick={() => dispatch(pushPopup(
                  MoaMemberPopup, {
                    data,
                    user_expose_type,
                    isMemberList: true,
                    withdrawMember: (memberId: HashId) => {
                      withdrawMember(memberId);
                    }
                  }
                ))}
              >
                <h2>{data.user.name || data.user.nick_name}</h2>
                <p>{data.user.auth_id}</p>
              </UserFollowCardBox>
            </UserFollowCardLink>
          ))}
        </StyledSlider>
      ) : (
        <NoContent backgroundImg={staticUrl('/static/images/banner/img-nocontent-friend.png')}>
          최근 가입 회원이 없습니다.
        </NoContent>
      )}
    </StyledAddtionalContentItemPC>
  );
});

export default MoaRecentlyJoinedMemberPC;
