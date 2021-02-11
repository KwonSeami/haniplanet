import * as React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY, $WHITE} from '../../styles/variables.types';
import ProfileJobForm from '../profile/form/ProfileJobForm';
import Button from '../inputs/Button';
import {HashId} from '@hanii/planet-types';
import {staticUrl} from '../../src/constants/env';
import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import cn from 'classnames';
import {DEGREE_TYPE_TO_KOR, PROGRESS_STATUS_TO_KOR} from '../../src/constants/profile';
import Label from '../UI/tag/Label';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import {fetchBandThunk} from '../../src/reducers/orm/band/thunks';
import {appendUserHospital, patchUserHospital, removeHospitalMemberThunk} from '../../src/reducers/hospital';
import {IHospitalMember} from '../../src/@types/IHospital';
import DoctalkBadge from '../doctalk/DoctalkBadge';
import DoctalkButton from '../doctalk/Button';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import BandApi from '../../src/apis/BandApi';

const AvatarDiv = styled.div`
  position: absolute;
  top: 20px;
  left: 15px;
  width: 64px;
  height: 75px;
  box-sizing: border-box;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
`;

const TeamH3 = styled.h3`
  padding-left: 76px;

  a {
    ${fontStyleMixin({
      size: 18,
      color: $FONT_COLOR
    })};
  }

  span {
    vertical-align: top;

    &.doctor-position {
      display: inline-block;
      padding-top: 3px;
      margin: 0 3px;
      ${fontStyleMixin({
        size: 12,
        color: $POINT_BLUE
      })};
    }
  }
`;

const TeamInfoUl = styled.ul`
  position: relative;
  padding-top: 10px;
  border-top: 1px solid #eee;

  > li {
    position: relative;

    &.medical-field {
      padding: 0 21px 0 76px;
    }

    &.edu-li {
      margin-top: 3px;
    }

    &.job-btn-wrapper {
      margin-top: 10px;

      ul {
        width: 100%;
        display: table;
        table-layout: fixed;

        li {
          display: table-cell;
          padding: 0 2px;
        }
      }
    }

    > h3 {
      position: absolute;
      top: 3px;
      left: 0;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })};
    }

    > p {
      padding-left: 76px;
      margin-bottom: 4px;
      ${fontStyleMixin({
        size: 12,
        color: $FONT_COLOR
      })};

      .degree {
        margin: -3px 0 0 4px;
      }
    }
  }
`;

const MoreSpan = styled.span`
  position: absolute;
  top: 2px;
  right: 0;
  width: 17px;
  height: 17px;
  line-height: 12px;
  text-align: center;
  border: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;
  

  &.on {
    background-color: #f9f9f9;
  }

  img {
    width: 7px;
    vertical-align: middle;
  }
`;

const MedicalFieldCard = styled.span`
  display: inline-block;
  padding: 1.4px 5.9px 2.6px 7.1px;
  background-color: #edf5ff;
  border-radius: 3px;
  margin: 0 4px 4px 0;
  ${fontStyleMixin({
    size: 12,
    weight: '600',
    color: $FONT_COLOR
  })};
`;

const JobInfoEditBtn = styled(Button)`
  &.toggle {
    background-color: #f9f9f9;

    img {
      transform: rotate(0);
    }
  }

  img {
    width: 13px;
    margin: -2px 0 0 4px;
    vertical-align: middle;
    transform: rotate(180deg);
  }
`;

const MedicalTeamli = styled.li`
  position: relative;
  min-height: 113px;
  padding: 20px 15px 21px;
  border-bottom: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;
  
  .greeting {
    min-height: 51px;
    padding-left: 77px;
    margin: 1px 0 10px;
    box-sizing: border-box;

    p {
      ${fontStyleMixin({
        size: 14,
        color: $GRAY
      })};
    }
  }
`;

const MedicalTeamDiv = styled.div`
  margin: 16px 0 -16px;  
  border-top: 8px solid #f6f7f9;
  box-shadow: 0 1px #eee inset;


  &.not-medical {
    border: 0;
  }

  .medical-add {
    margin-bottom: -17px;
    padding: 18px 15px;

    button {
      width: 100%;
      height: 40px;
      background-color: #90b0d7;
      border-radius: 0;
      ${fontStyleMixin({
        size: 14,
        weight: 'bold',
        color: $WHITE
      })};

      img {
        width: 13px;
        margin: -3px 4px 0;
        vertical-align: middle;

        &:last-child {
          width: 13px;
          transform: rotate(-90deg);
        }
      }
    }
  }

  &.not-visitor {
    > ul > li:last-child {
      border-bottom: 0;
    }
  }
`;

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
  }
  onClick: () => void;
  isMe: boolean;
  myHospital?: {
    avatar: string;
    name: string
    telephone: string;
    slug: string;
    address: string;
    detail_address: string;
    id: HashId;
    grade: string;
    position: string;
    subject_list: string[];
    self_introduce: string;
  }
}

interface Props extends IMedicalTeamCompProps {
  setEditInfo: React.Dispatch<React.SetStateAction<boolean>>;
  editInfo: boolean;
  hasAdminPermission?: boolean;
}

const HospitalMedicalTeamMember = React.memo<Props>(({
  position,
  isMe,
  subject_list,
  self_introduce,
  user: {
    avatar,
    id,
    name,
    educations,
    briefs,
    thesis,
    is_doctalk_doctor
  },
  setEditInfo,
  editInfo,
  hasAdminPermission,
}) => {
  const [showMore, setShowMore] = React.useState(false);
  const showText = showMore ? '접기' : '펼치기';

  const dispatch = useDispatch();
  const router = useRouter();
  const {query:{slug}} = router;

  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const {profile, myId, hospital} = useSelector(
    ({profile, hospital, system: {session: {id}}}) => ({
      profile,
      myId: id,
      hospital,
    }),
    shallowEqual
  );

  const myProfile = profile[myId];

  const hasEdu = !isEmpty(myProfile) && !isEmpty(myProfile.edu.ids);
  const hasBri = !isEmpty(myProfile) && !isEmpty(myProfile.brief.ids);

  return (
    <>
      <MedicalTeamli>
        <AvatarDiv
          style={{
            backgroundImage: `url(${avatar || staticUrl('/static/images/icon/img-default-user.png')})`,
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
            <DoctalkBadge
              className="doctalk-badge"
              type="long"
            />
          )}
        </TeamH3>
        <div className="greeting">
          {self_introduce && (
            <p>{self_introduce}</p>
          )}
        </div>
        <TeamInfoUl id={id}>
          {!isEmpty(subject_list) && (
            <li className="medical-field">
              <h3>진료분야</h3>
              <div>
                {subject_list.map(subject => (
                  <MedicalFieldCard key={subject}>
                    {subject}
                  </MedicalFieldCard>
                ))}
              </div>
              <MoreSpan
                className={cn('on')}
                onClick={() => setShowMore(curr => !curr)}
              >
                <img
                  src={staticUrl(showMore
                    ? '/static/images/icon/icon-delete-minus.png'
                    : '/static/images/icon/icon-more-plus.png'
                  )}
                  alt={showText}
                />
              </MoreSpan>
            </li>
          )}
          {showMore && (
            <>
              <li className="edu-li">
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
                {!isEmpty(briefs) ? briefs.map(({id, title}) => (
                  <p key={id}>{title}</p>
                )) : <br/>}
              </li>
              <li>
                <h3>저서/논문</h3>
                {!isEmpty(thesis) ? thesis.map(({id, title}) => (
                  <p key={id}>{title}</p>
                )) : <br/>}
              </li>
            </>
          )}
          {isMe && (
            <li className="job-btn-wrapper">
              <ul>
                <li>
                  <JobInfoEditBtn
                    className={cn({toggle: editInfo})}
                    size={{
                      width: '100%',
                      height: '35px'
                    }}
                    border={{
                      width: '1px',
                      radius: '0',
                      color: $BORDER_COLOR
                    }}
                    font={{
                      size: '12px',
                      weight: 'bold',
                      color: $FONT_COLOR
                    }}
                    onClick={() => setEditInfo(curr => !curr)}
                  >
                    재직 정보 관리
                    <img
                      src={staticUrl('/static/images/icon/arrow/icon-story-fold-arrow.png')}
                      alt="재직 정보 관리"
                    />
                  </JobInfoEditBtn>
                </li>
                {!is_doctalk_doctor && (
                  <li>
                    <DoctalkButton/>
                  </li>
                )}
              </ul>
            </li>
          )}
        </TeamInfoUl>
        {(isMe && editInfo) && (
          <ProfileJobForm
            onLeftBtnClick={() => setEditInfo(false)}
            initialData={hospital[myId][slug]}
            onRightBtnClick={data => {
              if (hasEdu) {
                if (hasBri) {
                  confirm('수정하시겠습니까?') && (
                    isEmpty(data)
                      ? alert('수정되었습니다.')
                      : dispatch(patchUserHospital(
                        slug,
                        hospital[myId][slug].id,
                        data,
                        () => {
                          dispatch(fetchBandThunk(bandApi, slug, 1));
                          alert('수정되었습니다.');
                          router.reload();
                        })
                      )
                  );
                } else {alert('약력은 필수 입력 항목입니다.');}
              } else {
                alert('학력은 필수 입력 항목입니다.');
              }
            }}
            ableToDelete={!hasAdminPermission}
            onDelete={() => {
              confirm('삭제하시겠습니까?') && (
                dispatch(removeHospitalMemberThunk(
                  slug,
                  hospital[myId][slug].id,
                  () => {
                    dispatch(fetchBandThunk(bandApi, slug, 1));
                    alert('삭제되었습니다.');
                  }
                ))
              );
              router.reload();
            }}
          />
        )}
      </MedicalTeamli>
    </>
  );
});

interface IHospitalMedicalTeam {
  members: IHospitalMember[];
  isJobFormOpened?: boolean;
  band: {
    slug: string;
    id: HashId;
  }
  hasAdminPermission?: boolean;
  band_member_grade: string;
}

const HospitalMedicalTeam = ({
  members, 
  isJobFormOpened, 
  band, 
  hasAdminPermission,
  band_member_grade
}) => {
  const [jobFormToggle, setJobFormToggle] = React.useState(isJobFormOpened);
  const [myHospital, setMyHospital] = React.useState({});
  const [editInfo, setEditInfo] = React.useState(isJobFormOpened);

  const dispatch = useDispatch();
  const router = useRouter();
  const {query} = router;
  const [isNew, setIsNew] = React.useState(isJobFormOpened && query.medicalTeam !== 'edit');

  const {profile, myId, hospital, me} = useSelector(
    ({orm, profile, hospital, system: {session: {id}}}) => ({
      profile,
      myId: id,
      hospital,
      me: (pickUserSelector(id)(orm) || {})
    }),
    shallowEqual
  );

  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const myProfile = profile[myId];

  const hasEdu = !isEmpty(myProfile) && !isEmpty(myProfile.edu.ids);
  const hasBri = !isEmpty(myProfile) && !isEmpty(myProfile.brief.ids);

  React.useEffect(() => {
    if (!!myId && !isEmpty(hospital)) {
      setMyHospital(hospital[myId] || {});
    }
  },[hospital, myId]);

  React.useEffect(() => {
    setJobFormToggle(isJobFormOpened);
    setEditInfo(isJobFormOpened);
  },[isJobFormOpened]);

  React.useEffect(() => {
    dispatch(fetchBandThunk(bandApi, band.slug));
  }, [band.slug]);

  return (
    <>
      <h3>
        <img
          src={staticUrl('/static/images/icon/icon-hospital-medicalteam2.png')}
          alt="의료진"
        />
        의료진
        <span
          onClick={() => setJobFormToggle(curr => !curr)}
          className={cn('pointer', {toggle: jobFormToggle})}
        >
          {jobFormToggle ? '접기' : '펼쳐보기'}
          <img
            src={staticUrl('/static/images/icon/arrow/icon-medicalteam-fold.png')}
            alt="펼쳐보기/접기"
          />
        </span>
      </h3>
      {jobFormToggle && (
        <MedicalTeamDiv className={cn({
            'not-medical': isEmpty(members),
            'not-visitor': band_member_grade !== 'visitor'
          })}
        >
          <ul>
            {members.map(data => (
              !(data.user.id === myId && !myHospital[band.slug]) &&
                <HospitalMedicalTeamMember
                  key={data.user.id}
                  {...data}
                  isMe={data.user.id === myId}
                  setEditInfo={setEditInfo}
                  myHopital={myHospital[band.slug]}
                  hasAdminPermission={hasAdminPermission}
                  editInfo={editInfo}
                />
            ))}
          </ul>
          {(!isEmpty(me) && me.user_type === 'doctor') && (band_member_grade === 'visitor') && (
            <div className="medical-add">
              <Button onClick={() => {
                setJobFormToggle(true);
                setIsNew(true);
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
          )}
        </MedicalTeamDiv>
      )}
      {(jobFormToggle && isNew) && (
        <ProfileJobForm
          onLeftBtnClick={() => setIsNew(false)}
          onRightBtnClick={data => {
            if (hasEdu) {
              if (hasBri) {
                confirm('저장하시겠습니까?') && (
                  dispatch(appendUserHospital(
                    band.slug,
                    data,
                    () => {
                      dispatch(fetchBandThunk(bandApi, band.slug, 1));
                      alert('저장되었습니다.');
                      setIsNew(false);
                      router.replace(`/band/${band.slug}/`);
                    }
                  ))
                );
              } else {alert('약력은 필수 입력 항목입니다.');}
            } else {
              alert('학력은 필수 입력 항목입니다.');
            }
          }}
        />
      )}
    </>
  );
};

export default React.memo<IHospitalMedicalTeam>(HospitalMedicalTeam);