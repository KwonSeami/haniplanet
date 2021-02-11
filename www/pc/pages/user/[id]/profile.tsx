import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import Label from '../../../components/UI/tag/Label';
import ProfileEdu from '../../../components/profile/ProfileEdu';
import ProfileBrief from '../../../components/profile/ProfileBrief';
import ProfileThesis from '../../../components/profile/ProfileThesis';
import ProfileLicense from '../../../components/profile/ProfileLicense';
import ProfileSkill from '../../../components/profile/ProfileSkill';
import ProfileTool from '../../../components/profile/ProfileTool';
import ProfileHospital from '../../../components/profile/ProfileHospital';
import useProfile from '../../../src/hooks/user/useProfile';
import {toDateFormat} from '../../../src/lib/date';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin, heightMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import {GENDER_TO_KOR, USER_TYPE_TO_KOR} from '../../../src/constants/users';
import {$GRAY, $POINT_BLUE, $TEXT_GRAY, $FONT_COLOR, $BORDER_COLOR} from '../../../styles/variables.types';
import loginRequired from '../../../hocs/loginRequired';
import Loading from '../../../components/common/Loading';
import NoContentText from '../../../components/profile/style/NoContentText';
import Avatar from '../../../components/Avatar';

const BannerDiv = styled.div`
  height: 267px;
  box-sizing: border-box;
  padding-top: 45px;
  text-align: center;
  position: relative;
  border-bottom: 1px solid ${$BORDER_COLOR};

  h2 {
    padding-top: 9px;
    letter-spacing: -1.5px;
    ${fontStyleMixin({size: 30, weight: '300'})};
  }

  p {
    ${fontStyleMixin({
      size: 18, 
      weight: '300', 
      color: $TEXT_GRAY
    })};
  }  

  a {
    display: block;
    position: absolute;
    left: 40px;
    top: 80px;
    ${fontStyleMixin({
      size: 15, 
      color: $GRAY
    })};
    
    img {
      width: 30px;
      display: inline-block;
      vertical-align: middle;
      margin: -5px 11px 0 0;
    }
  }
  
  .avatar {
    height: 93px;
    
    & > div {
      margin: auto;
    }
  }
`;

const TabUl = styled.ul`
  position: relative;
  z-index: 1;
  width: 680px;
  margin: -1px auto auto;

  li {
    float: left;
    width: 33.333%;
    box-sizing: border-box;
    text-align: center;

    a {
      display: block;
      width: 100%;
      height: 54px;
      line-height: 46px;
      ${fontStyleMixin({
        size: 15, 
        color: $TEXT_GRAY, 
        weight: '300'
      })};
    }
    

    &.on a {
      border-top: 1px solid ${$POINT_BLUE};
      ${fontStyleMixin({
        weight: '600', 
        color: $FONT_COLOR
      })};
    }
  }
`;

/* TODO: 기본정보 */
const BasicUl = styled.ul`
  padding: 30px 0 26px;
  width: 680px;
  margin: auto auto 100px;
  border-top: 1px solid ${$BORDER_COLOR};
  border-bottom: 1px solid ${$BORDER_COLOR};
  
 
  li{
    position: relative;
    padding: 0 0 10px 186px;
  
    &.profile-secret {
      padding: 0;
    }
  }
  
  h3 {
    position: absolute;
    left: 64px;
    top: 15px;
    ${fontStyleMixin({size: 11, weight: 'bold'})};

    img {
      width: 16px;
      display: inline-block;
      vertical-align: middle;
      margin: -2px 5px 0 0;
    }
  }

  p {
    font-size: 15px;
    border-bottom: 1px solid ${$BORDER_COLOR};
    ${heightMixin(44)};
  }
`;

export const ProfileNoContentText = styled(NoContentText)`
  height: auto !important;
  padding: 64px 0 73px;
  line-height: 1.5 !important;
  margin: 0;
  border: 0 !important;

  img {
    display: block;
    margin: auto;
    width: 30px;
    height: 30px;
    padding-bottom: 5px;
  }
`;

const ProfileAddDiv = styled.div`
  padding: 22px 0 173px;
`;

const StyledProfileTool = styled(ProfileTool)`
  border-bottom: 1px solid ${$BORDER_COLOR};
`;

const UserProfilePC = React.memo(() => {
  const {query: {id}} = useRouter();
  const {user, me, currTab} = useProfile(id);
  const [showAddTab, setShowAddTab] = React.useState(false);

  if (isEmpty(user) || isEmpty(me)) {
    return <Loading />;
  }
  const {id: myId} = me;
  const {
    phone,
    birth,
    gender,
    address,
    email,
    avatar,
    name,
    user_type} = user;

  const userinfo = {
    phone: {
      imgSrc: '/static/images/icon/icon-profile-phone.png',
      imgAlt: "휴대폰번호",
      text: phone
      },
    birth: {
      imgSrc:'/static/images/icon/icon-profile-birth.png',
      imgAlt: "생년월일",
      text: toDateFormat(birth, 'YYYYMMDD')
    },
    gender: {
      imgSrc:'/static/images/icon/icon-profile-gender.png',
      imgAlt: "성별",
      text: GENDER_TO_KOR[gender]
    },
    address: {
      imgSrc:'/static/images/icon/icon-profile-map.png',
      imgAlt: "주소",
      text: address
    },
    email: {
      imgSrc:'/static/images/icon/icon-profile-mail.png',
      imgAlt: "E-mail",
      text: email
    }
  };

  return (
    <section>
      <BannerDiv>
        <Avatar
          size={93}
          src={avatar || staticUrl('/static/images/icon/icon-large-profile.png')}
          userExposeType="real"
        />
        <h2>
          {name}
        </h2>
        <Label
          name={USER_TYPE_TO_KOR[user_type]}
          color={$FONT_COLOR}
          borderColor="#999"
        />
        <Link href={`/user/${myId}`}>
          <a>
            <img
              src={staticUrl('/static/images/icon/arrow/icon-big-shortcuts.png')}
              alt="MY PAGE"
            />
            MY PAGE
          </a>
        </Link>
      </BannerDiv>

      {/* @진혜연: Link가 추가됨에 따라 스타일 수정이 필요합니다. */}
      <TabUl className="clearfix">
        <li className={cn({on: currTab === ''})}>
          <Link href={`/user/${id}/profile`}>
            <a>기본정보</a>
          </Link>
        </li>
        <li className={cn({on: currTab === 'additional'})}>
          <Link href={`/user/${id}/profile/?tab=additional`}>
            <a>추가정보</a>
          </Link>
        </li>
        <li className={cn({on: currTab === 'hospital'})}>
          <Link href={`/user/${id}/profile/?tab=hospital`}>
            <a>재직중인 한의원</a>
          </Link>
        </li>
      </TabUl>

      {/* 기본정보 */}
      {currTab === '' && (
        <BasicUl>
          {!!(phone || birth || gender || address || email) ? (
            Object.keys(userinfo).map(key => {
              const {imgSrc, imgAlt, text} = userinfo[key];

              return !!text && (
                <li key={text}>
                  <h3>
                    <img
                      src={imgSrc}
                      alt={imgAlt}
                    />
                    {imgAlt}
                  </h3>
                  <p>{text}</p>
                </li>
              )
            })
          ) : (
            <li className="profile-secret">
              <ProfileNoContentText>
                <img
                  src={staticUrl('/static/images/icon/icon-secret.png')}
                  alt="공개된 내용이 없습니다."
                />
                공개된 내용이 없습니다.
              </ProfileNoContentText>
            </li>
          )}
        </BasicUl>
        )}

      {/* 추가정보 */}
      {currTab === 'additional' && (
        <>
          <ProfileAddDiv>
            <ProfileEdu id={id} setShowAddTab={setShowAddTab}/>
            <ProfileBrief id={id} setShowAddTab={setShowAddTab}/>
            <ProfileThesis id={id} setShowAddTab={setShowAddTab}/>
            <ProfileLicense id={id} setShowAddTab={setShowAddTab}/>
            <ProfileSkill id={id} setShowAddTab={setShowAddTab}/>
            <StyledProfileTool id={id} setShowAddTab={setShowAddTab}/>
            {!showAddTab && (
              <BasicUl>
                <li className="profile-secret">
                  <ProfileNoContentText>
                    <img
                      src={staticUrl('/static/images/icon/icon-secret.png')}
                      alt="공개된 내용이 없습니다."
                    />
                    공개된 내용이 없습니다.
                  </ProfileNoContentText>
                </li>
              </BasicUl>
            )}
          </ProfileAddDiv>
        </>
      )}

      {/* 한의원 */}
      {currTab === 'hospital' && (
        <ProfileHospital id={id}/>
      )}
    </section>
  );
});

UserProfilePC.displayName = 'UserProfilePC';
export default loginRequired(UserProfilePC);
