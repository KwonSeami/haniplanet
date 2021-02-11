import React from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import cn from 'classnames';
import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import {staticUrl} from '../../src/constants/env';
import {DEGREE_TYPE_TO_KOR, PROGRESS_STATUS_TO_KOR} from '../../src/constants/profile';
import {$BORDER_COLOR, $FONT_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY, $WHITE} from '../../styles/variables.types';
import ProfileJobForm from '../profile/form/ProfileJobForm';
import {fontStyleMixin, backgroundImgMixin} from '../../styles/mixins.styles';
import Label from '../UI/tag/Label';
import GuideLabel from '../story/branches/GuideLabel';
import Button from '../inputs/Button';
import {
  appendUserHospital,
  patchUserHospital,
  removeHospitalMemberThunk,
} from '../../src/reducers/hospital';
import {useRouter} from 'next/router';
import {fetchBandThunk} from '../../src/reducers/orm/band/thunks';
import DoctalkBadge from '../doctalk/DoctalkBadge';
import DoctalkButton from '../doctalk/Button';
import { pickUserSelector } from '../../src/reducers/orm/user/selector';
import MedicalTeamFaq from './medicalTeamFaq';
import BandApi from '../../src/apis/BandApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';

const MedicalTeamUl = styled.ul`
  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    height: calc(100% - 60px);
    border-left: 1px solid #eee;
    z-index: 1;
  }
  
  .medical-add {
    display: inline-block;
    padding: 27px 30px 24px 24px;

    > div {
      width: 445px;
      height: 152px;
      margin: 0;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/banner/img-medical-add-bg.png')
      })};
      overflow: hidden;

      button {
        display: block;
        width: 160px;
        height: 40px;
        margin: 58px auto 0;
        ${fontStyleMixin({
          size: 14,
          weight: 'bold',
          color: $WHITE
        })}
        border-radius: 0;
        background-color: #90b0d7;

        img {
          vertical-align: middle;
          margin: -2px 4px 0;
          
          &:first-child {
            width: 13px;
          }

          &:last-child {
            width: 11px;
            transform: rotate(-90deg);
            opacity: 0.4;
          }
        }
      }
    }
  }

  &.not-medical {
    &:before {
      display: none;
    }
    
    .medical-add {
      display: block;
      padding: 0;
      overflow: hidden;

      > div {
        margin: 26px auto 30px;
      }
    }
  }
`;

const MedicalTeamli = styled.li`
  position: relative;
  width: 100%;
  min-height: 111px;
  border-bottom: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;
  vertical-align: top;

  & > div {
    display: inline-block;
    width: 50%;
    box-sizing: border-box;
    vertical-align: top;

    &.profile {
      position: relative;
      padding: 30px 25px 30px 30px;
    }

    &.faq {
      padding: 30px 30px 15px 26px;
    }

  }

  .right-content-wrapper {
    position: relative;

    .greeting {
      min-height: 82px;
      margin-bottom: 10px;
      padding-left: 107px;
  
      p {
        line-height: 20px;
        text-align: justify;
        margin-bottom: 41px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4; 
        -webkit-box-orient: vertical;
        ${fontStyleMixin({
          size: 15,
          color: $GRAY
        })};
      }
    }

    .btns {
      min-height: 30px;
    }

    .doctalk-btn {
      position: absolute;
      bottom: 0;
      right: 97px;
    }
  }
`;

const AvatarDiv = styled.div`
  position: absolute;
  top: 30px;
  left: 30px;
  width: 90px;
  height: 108px;
  box-sizing: border-box;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
`;

const TeamH3 = styled.h3`
  padding: 7px 0 5px 106px;

  a {
    ${fontStyleMixin({
      size: 18,
      weight: '600',
      color: '#4a4a4a'
    })};
  }

  span.doctor-position {
    display: inline-block;
    vertical-align: top;
    padding-top: 3px;
    margin-left: 5px;
    ${fontStyleMixin({
      size: 14,
      color: $POINT_BLUE
    })};
  }
`;

const JobInfoEditBtn = styled(Button)`
  position: absolute;
  bottom: 0;
  right: -2px;
  
  img {
    width: 6px;
    height: 13px;
    margin: 0 -3px -2px 4px;
  }
`;

const TeamInfoUl = styled.ul`
  position: relative;
  padding-top: 9px;
  margin-top: 10px;
  border-top: 1px solid #eee;

  > li {
    position: relative;

    &.medical-field {
      padding: 0 0 0 107px;

      div {
        max-width: 295px;
      }
    }

    h3 {
      position: absolute;
      left: 4px;
      top: 7px;
      ${fontStyleMixin({
        size: 14,
        color: $TEXT_GRAY
      })};
    }

    > p {
      padding-bottom: 10px;
      ${fontStyleMixin({
        size: 14,
        color: $FONT_COLOR,
      })};
    }

    ul {
      position: absolute;
      z-index: 2;
      top: 10px;
      left: 4px;
      width: 446px;
      padding: 12px 0 3px 13px;
      border: 1px solid ${$GRAY};
      box-sizing: border-box;
      background-color: ${$WHITE};

      li {
        min-height: 30.7px;
        position: relative;
        padding: 1px 0 0 88px;

        &:nth-child(3) {
          padding-bottom: 6px;
        }

        h3 {
          position: absolute;
          left: -2px;
          top: 4px;
          ${fontStyleMixin({
            size: 14,
            color: $TEXT_GRAY
          })};
        }

        p {
          width: 329px;
          padding-bottom: 9px;
          ${fontStyleMixin({
            size: 14,
            color: $FONT_COLOR,
          })};

          .degree {
            margin: -3px 0 0 4px;
          }
        }
      }
    }
  }
`;

const MoreSpan = styled.span`
  position: absolute;
  top: 1px;
  right: 0px;
  width: 25px;
  height: 25px;
  text-decoration: underline;
  text-align: center;
  border: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;

  &:hover {
    background-color: #f9f9f9;
  }

  img {
    width: 100%;
    vertical-align: middle;
    margin-left: 1px;
  }
`;

const MedicalFieldCard = styled(GuideLabel)`
  height: auto;
  padding: 3px 6px 3px 7px;
  background-color: #edf5ff;
  border-radius: 3px;
  margin-right: 6px;
  margin-top: 4px;
  ${fontStyleMixin({
    size: 13,
    weight: '600',
    color: $FONT_COLOR
  })};
`;

const FaqWrapperDiv = styled.div`
  header {
    position: relative;
    margin-bottom: 5px;

    h3 {
      display: inline-block;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 16,
        color: $FONT_COLOR,
        weight: 'bold'
      })};
    }

    p {
      display: inline-block;
      margin-left: 7px;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 11,
        color: $GRAY
      })};

      span {
        color: ${$POINT_BLUE};
      }
    }
    & > span {
      position: absolute;
      right: 0;
      top: 0;
      white-space: nowrap;
    }
    a {
      position: relative;
      padding-right: 11px;
      line-height: inherit;
      text-decoration: underline;
      ${fontStyleMixin({
        size: 11,
        color: '#bbb'
      })};
      & ~ a {
        margin-left: 13px;

        &::before {
          position: absolute; 
          top: 50%;
          left: -8px;
          width: 1px;
          height: 10px;
          background-color: #bbb;
          margin-top: -5px;
          content: '';
        }
      }
      &::after {
        position: absolute;
        right: 0;
        top: 50%;
        width: 11px;
        height: 11px;
        content: '';
        transform: translateY(-50%);
        ${backgroundImgMixin({
          img: staticUrl('/static/images/icon/arrow/arrow-right-gray11x11.png'),
          size: '100% auto'
        })};
      }
    }
  }
`;

const FaqNoContent = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  width: 50%;
  text-align: center;
  line-height: 1.5;
  transform: translateY(-50%);
  font-family: 'Noto Sans KR';
  ${fontStyleMixin({
    size: 12,
    color: $TEXT_GRAY,
    family: 'Montserrat'
  })};
`;

const MAX_DOCTALK_FAQ_LENGTH = 2;

interface IMedicalTeamCompProps {
  position: TPosition;
  subject_list: TSubject[];
  self_introduce: string;
  user: {
    avatar: string;
    id: HashId;
    name: string;
    educations: IProfileEdu[];
    briefs: IProfileBrief[];
    thesis: IProfileThesis[];
    is_doctalk_doctor: boolean;
    doctalk_faqs: IDocTalkFaq[];
  };
  onClick: () => void;
  isMe: boolean;
}

interface Props extends IMedicalTeamCompProps {
  setEditInfo: React.Dispatch<React.SetStateAction<boolean>>;
  isHospitalInfo: boolean;
}

const MedicalTeamComp = React.memo<Props>(({
  position,
  subject_list,
  self_introduce,
  user: {
    avatar,
    id,
    name,
    educations,
    briefs,
    thesis,
    is_doctalk_doctor,
    doctalk_faqs,
    doctalk_faqs_count
  },
  isHospitalInfo,
  isMe,
  onClick,
}) => {
  const [showMore, setShowMore] = React.useState(false);
  const showText = showMore ? '접기' : '펼치기';

  if (isMe && !isHospitalInfo) { return null; }

  return (
    <>
      <MedicalTeamli>
        <div className="profile">
          <AvatarDiv
            style={{
              backgroundImage: `url(${avatar || staticUrl('/static/images/banner/img-default-user.png')})`,
            }}
          />
          <TeamH3>
            <Link
              href="/user/[id]"
              as={`/user/${id}`}
            >
              <a>{name}</a>
            </Link>
            {position && (
              <span className="doctor-position">{position}</span>
            )}
            {is_doctalk_doctor && (
              <DoctalkBadge type="long"/>
            )}
          </TeamH3>
          <div className="right-content-wrapper">
            <div className="greeting">
              {self_introduce && (
                <p>{self_introduce}</p>
              )}
            </div>
            <div className="btns">
              {isMe && (
                <>
                  {!is_doctalk_doctor && (
                    <DoctalkButton
                      className="doctalk-btn"
                      hasTooltip
                    />
                  )}
                  <JobInfoEditBtn
                    size={{
                      width: '94px',
                      height: '30px'
                    }}
                    border={{
                      color: $GRAY,
                      width: '1px'
                    }}
                    font={{
                      size: '11px',
                      weight: 'bold'
                    }}
                    onClick={onClick}
                  >
                    재직 정보 관리
                    <img
                      src={staticUrl('/static/images/icon/arrow/icon-hospital-edit.png')}
                      alt="재직 정보 관리"
                    />
                  </JobInfoEditBtn>
                </>
              )}
            </div>
          </div>
          
          <TeamInfoUl id={id}>
            {!isEmpty(subject_list) && (
              <li className="medical-field">
                <h3>진료분야</h3>
                <div>
                  {subject_list.map(subject => (
                    <MedicalFieldCard
                      key={subject}
                      name={subject}
                    />
                  ))}
                </div>
                <MoreSpan
                  className="more pointer"
                  onMouseOver={() => setShowMore(curr => !curr)}
                  onMouseOut={() => setShowMore(curr => !curr)}
                >
                  <img
                    src={staticUrl(showMore
                      ? '/static/images/icon/icon-unfold-minus.png'
                      : '/static/images/icon/icon-more-plus.png'
                    )}
                    alt={showText}
                  />
                </MoreSpan>
              </li>
            )}
            <li>
              {showMore && (
                <ul>
                  <li>
                    <h3>학력</h3>
                    {educations.map(({
                      id,
                      school_name,
                      major_name,
                      progress_status,
                      degree_type
                    }) => (
                      <p key={id}>
                        {school_name} {major_name} {PROGRESS_STATUS_TO_KOR[progress_status]}
                        <Label
                          name={DEGREE_TYPE_TO_KOR[degree_type]}
                          color={$FONT_COLOR}
                          borderColor="#999"
                          className="degree"
                        />
                      </p>
                    ))}
                  </li>
                  <li>
                    <h3>약력</h3>
                    {briefs.map(({id, title}) => (
                      <p key={id}>{title}</p>
                    ))}
                  </li>
                  <li>
                    <h3>저서/논문</h3>
                    {!isEmpty(thesis) && thesis.map(({id, title}) => (
                      <p key={id}>{title}</p>
                    ))}
                  </li>
                </ul>
              )}
            </li>
          </TeamInfoUl>
        </div>
        <div 
          className={cn('faq', {
            bg: isEmpty(doctalk_faqs) || !is_doctalk_doctor
          })}
        >
          <FaqWrapperDiv>
            <header>
              <h3>FAQ</h3>
              {is_doctalk_doctor && (
                <>
                  {!isEmpty(doctalk_faqs) && (
                    <p>총 <span>{doctalk_faqs_count}</span>건</p>
                  )}
                  <span>
                    {isMe && (
                      <Link
                        href="/user/faq"
                      >
                        <a>
                          <span>FAQ 관리</span>
                        </a>
                      </Link>
                    )}
                    <Link
                      href="/user/[id]/faq"
                      as={`/user/${id}/faq`}
                    >
                      <a>
                        <span>FAQ 목록</span>
                      </a>
                    </Link>
                  </span>
                </>
              )}
            </header>
            <div>
              {!is_doctalk_doctor ? (
                <FaqNoContent>
                  {isMe ? (
                    <>
                    FAQ 관리를 위해서는<br/>
                    닥톡 연동이 필요합니다.
                    </>
                  ) : '작성된 FAQ가 없습니다.'}
                </FaqNoContent>
              ) : !isEmpty(doctalk_faqs) ? (
                <ul>
                  {doctalk_faqs.slice(0, MAX_DOCTALK_FAQ_LENGTH).map(({id, ...props}) => (
                    <MedicalTeamFaq 
                      key={id} 
                      id={id}
                      {...props}
                    />
                  ))}
                </ul>
              ) : (
                <FaqNoContent>
                  작성된 FAQ가 없습니다.
                </FaqNoContent>
              )}
            </div>
          </FaqWrapperDiv>
        </div>
      </MedicalTeamli>
    </>
  );
});

const MedicalTeam = ({
  members, 
  openJobForm, 
  band, 
  hasAdminPermission,
  band_member_grade
}) => {
  const [isOpened, setIsOpened] = React.useState(openJobForm);
  const [myHospital, setMyHospital] = React.useState({});
  const [editInfo, setEditInfo] = React.useState(openJobForm);

  const dispatch = useDispatch();
  const router = useRouter();
  const {query} = router;
  const [notNew, setNotNew] = React.useState(!openJobForm || query.medicalTeam === 'edit');
  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const {profile, myId, hospital, me} = useSelector(
    ({orm, profile, hospital, system: {session: {id}}}) => ({
      profile,
      myId: id,
      hospital,
      me: (pickUserSelector(id)(orm) || {})
    }),
    shallowEqual
  );

  React.useEffect(() => {
      if (!!myId && !isEmpty(hospital)){
        setMyHospital(hospital[myId] || {});
      }
    },[myId, hospital]
  );

  React.useEffect(() => {
    setIsOpened(openJobForm);
    setEditInfo(openJobForm);
  },[openJobForm]);

  React.useEffect(() => {
    dispatch(fetchBandThunk(bandApi, band.slug));
  }, [band.slug]);

  const myProfile = profile[myId];
  const hasEdu = !isEmpty(myProfile) && !isEmpty(myProfile.edu.ids);
  const hasBri = !isEmpty(myProfile) && !isEmpty(myProfile.brief.ids);

  return (
    <>
      <h3>
        <img
          src={staticUrl('/static/images/icon/icon-hospital-medicalteam2.png')}
          alt="의료진"
        />
        의료진
      </h3>
      <span
        onClick={() => setIsOpened(curr => !curr)}
        className={cn('pointer', {isOpened})}
      >
        {isOpened ? '접기' : '펼쳐보기'}
        <img
          src={staticUrl('/static/images/icon/arrow/icon-medicalteam-fold.png')}
          alt="펼쳐보기/접기"
        />
      </span>
      {isOpened && (
        <MedicalTeamUl className={cn({'not-medical': isEmpty(members)})}>
          {/* TODO */}
          {members.map(data => (
            <MedicalTeamComp
              key={data.user.id}
              {...data}
              isMe={data.user.id === myId}
              isHospitalInfo={!!myHospital[band.slug]}
              onClick={() => setEditInfo(curr => !curr)}
            />
          ))}
          {(!isEmpty(me) && me.user_type === 'doctor') && (band_member_grade === 'visitor') && (
            <li className="medical-add">
              <div>
                <Button onClick={() => {
                  setEditInfo(true);
                  setNotNew(false);
                }}>
                  <img
                    src={staticUrl('/static/images/icon/icon-Medical-add-plus.png')}
                    alt="의료진 등록"
                  />
                  의료진 등록
                  <img
                    src={staticUrl('/static/images/icon/arrow/icon-Medical-add-arrow.png')}
                    alt="의료진 등록"
                  />
                </Button>
              </div>
            </li>
          )}
        </MedicalTeamUl>
      )}
      {(isOpened && editInfo) && (
        <ProfileJobForm
          onLeftBtnClick={() => setEditInfo(false)}
          initialData={notNew && myHospital[band.slug]}
          onRightBtnClick={data => {
            if (hasEdu) {
              if (hasBri) {
                !notNew
                  ? confirm('저장하시겠습니까?') && (
                  dispatch(appendUserHospital(
                    band.slug,
                    data,
                    () => {
                      dispatch(fetchBandThunk(bandApi, band.slug, 1));
                      alert('저장되었습니다.');
                      setEditInfo(false);
                      router.reload();
                    }
                  ))
                ) : (
                  confirm('수정하시겠습니까?') && (
                    isEmpty(data) ? alert('수정되었습니다.')
                      : dispatch(patchUserHospital(
                      band.slug,
                      myHospital[band.slug].id,
                      data,
                      () => {
                        dispatch(fetchBandThunk(bandApi, band.slug, 1));
                        alert('수정되었습니다.');
                        router.reload();
                      }
                      ))
                    )
                  );
              } else {alert('약력은 필수 입력 항목입니다.');}
            } else {
              alert('학력은 필수 입력 항목입니다.');
            }
          }}
          ableToDelete={notNew && !hasAdminPermission}
          onDelete={() => {
            confirm('삭제하시겠습니까?') && (
              dispatch(removeHospitalMemberThunk(
                band.slug,
                myHospital[band.slug].id,
                () => {
                  dispatch(fetchBandThunk(bandApi, band.slug, 1));
                  alert('삭제되었습니다.');
                }
              ))
            );
            router.reload();
          }}
        />
        )
      }
      </>
  );
};

export default React.memo(MedicalTeam);