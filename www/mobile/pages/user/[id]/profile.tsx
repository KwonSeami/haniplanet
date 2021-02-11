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
import {$GRAY, $POINT_BLUE, $TEXT_GRAY, $FONT_COLOR, $BORDER_COLOR, $WHITE} from '../../../styles/variables.types';
import { ProfileCardDiv } from '../../../components/UI/Card/ProfileCard';
import loginRequired from '../../../hocs/loginRequired';
import NoContentText from '../../../components/profile/style/NoContentText';
import Loading from '../../../components/common/Loading';
import Avatar from '../../../components/Avatar';

const BannerDiv = styled.div`
  height: 67px;
  padding-top: 35px;
  text-align: center;
  position: relative;
  background-color: #f5f7f9;
  text-align: center;

  & > div {
    position: relative;
    z-index: 1;
  }

  h2 {
    padding-top: 7px;
    letter-spacing: -1.5px;
    ${fontStyleMixin({
      size: 27,
      weight: '300',
    })}
  }

  p {
    ${fontStyleMixin({
      size: 19,
      weight: '300',
      color: $TEXT_GRAY
    })}
  }  
  
  .avatar {
    height: 78px;
    
    & > div {
      margin: auto;
    }
  }
`;

const StyledLabel = styled(Label)`
  margin: -3px 2px 0 2px;
  text-align: center;
`;

const TabDiv = styled.div`
  padding-top: 150px;
  margin-top: -30px;
  z-index: 0;
  position: relative;
  background-color: ${$WHITE};
`;

const TabUl = styled.ul`
  position: relative;
  z-index: 1;
  max-width: 680px;
  margin: auto;
  padding: 0 15px 9px;
  box-sizing: border-box;
  border-bottom: 1px solid ${$BORDER_COLOR};

  li {
    float: left;
    margin-right: 10px;

    a {
      ${fontStyleMixin({
        size: 16,
        color: $TEXT_GRAY,
        weight: '300'
      })}
    }
    
    &.on a {
      border-bottom: 1px solid ${$POINT_BLUE};
      ${fontStyleMixin({
        weight: '600',
        color: $FONT_COLOR
      })}
    }
  }
`;

/* TODO: 기본정보 */
const BasicUl = styled.ul`
  max-width: 680px;
  margin: auto auto 100px;
  padding: 0 15px;

  li {
    position: relative;
    padding-top: 20px;
    border-bottom: 1px solid ${$BORDER_COLOR};

    &.profile-secret {
      padding: 0;
      border: 0;
    }
  }
  
  h3 {
    ${fontStyleMixin({
      size: 11,
      weight: 'bold',
      color: $TEXT_GRAY
    })}
  }

  p {
    ${heightMixin(44)}
    font-size: 16px;
  }
`;

const ProfileAddDiv = styled.div`
  padding-bottom: 100px;
  
  ${ProfileCardDiv} {
    padding: 16px 14px 30px;

    h2 {
      position: static;
      font-size: 18px;
    }
  }
`;


export const ProfileNoContentText = styled(NoContentText)`
  width: 100% !important;
  max-width: 680px;
  height: auto !important;
  padding: 91px 0 100px;
  line-height: 1.5 !important;
  margin: 0;
  border: 0 !important;
  font-size: 14px !important;

  img {
    display: block;
    margin: auto;
    width: 30px;
    height: 30px;
    padding-bottom: 9px;
  }
`;

const StyledProfileEdu = styled(ProfileEdu)`
  border-top: 0;
`;

const StyledProfileTool = styled(ProfileTool)`
  border-bottom: 0;
`;

const UserProfileMobile= React.memo(() => {
  const {query: {id}} = useRouter();
  const {user, me, currTab} = useProfile(id);
  const [showAddTab, setShowAddTab] = React.useState(false);

  if (isEmpty(user) || isEmpty(me)) {
    return <Loading/>;
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
      title: "휴대폰번호",
      text: phone
    },
    birth: {
      title: "생년월일",
      text: toDateFormat(birth, 'YYYYMMDD')
    },
    gender: {
      title: "성별",
      text: GENDER_TO_KOR[gender]
    },
    address: {
      title: "주소",
      text: address
    },
    email: {
      title: "E-mail",
      text: email
    }
  };

  return (
    <section>
      <BannerDiv>
        <div>
          <Avatar
            size={78}
            src={avatar}
            userExposeType="real"
          />
          <h2>
            {name}
            <StyledLabel
              name={USER_TYPE_TO_KOR[user_type]}
              color={$FONT_COLOR}
              borderColor="#999"
            />
          </h2>
        </div>
      </BannerDiv>
      <TabDiv>
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
                const {title, text} = userinfo[key];

                return !!text && (
                  <li key={text}>
                    <h3>
                      {title}
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
        )}

        {/* 한의원 */}
        {currTab === 'hospital' && (
          <ProfileHospital id={id}/>
        )}
      </TabDiv>
    </section>
  );
});

UserProfileMobile.displayName = 'UserProfileMobile';
export default loginRequired(UserProfileMobile);
