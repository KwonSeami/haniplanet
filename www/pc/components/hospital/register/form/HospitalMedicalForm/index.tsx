import * as React from 'react';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import {useRouter} from 'next/router';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import TimeRangeTable from '../../../common/TimeRangeTable';
import Radio from '../../../../UI/Radio/Radio';
import HospitalMedicalFormDiv from './HospitalMedicalFormDiv';
import TextArea from '../../../common/TextArea';
import StyledMapShower from './StyledMapShower';
import ProfileJobForm from '../../../../profile/form/ProfileJobForm';
import StyledButtonGroup from './StyledButtonGroup';
import BandApi from '../../../../../src/apis/BandApi';
import validateHospitalRegister from '../../HospitalRegister/validate';
import useCallAccessFunc from '../../../../../src/hooks/session/useCallAccessFunc';
import {LocalCache} from "browser-cache-storage";
import {staticUrl} from '../../../../../src/constants/env';
import {appendUserHospital, fetchUserHospital, patchUserHospital} from '../../../../../src/reducers/hospital';
import {RootState} from '../../../../../src/reducers';

interface IHospitalMedicalItemProps {
  id?: string;
  imgSrc: string;
  description: string;
  children: React.ReactNode;
}

const HospitalMedicalItem: React.FC<IHospitalMedicalItemProps> = ({
  id,
  imgSrc,
  description,
  children,
}) => (
  <li id={id}>
    <h3>
      <img src={imgSrc} alt={description} />
      {description}
    </h3>
    {children}
  </li>
);

const HospitalMedicalForm = ({type, defaultTimeList, setIsOnBeforeunload}) => {
  const {register, watch, setValue, handleSubmit} = useFormContext();
  const address = watch('address');
  const can_park = watch('can_park');

  // State
  const [jobForm, setJobForm] = React.useState([]);
  const [doctorTabOpen, setDoctorTabOpen] = React.useState(true);

  // Redux
  const dispatch = useDispatch();
  const {myHospital, profile, myId} = useSelector(
    ({hospital, profile, system: {session: {id}}}: RootState) => ({
      myHospital: hospital,
      myId: id,
      profile
    }),
    shallowEqual,
  );

  // Router
  const {query: {slug}} = useRouter();

  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  React.useEffect(() => {
    if (myId) {
      !!myId && dispatch(fetchUserHospital(myId));
    }
  }, [myId]);

  return (
    <HospitalMedicalFormDiv className="clearfix">
      <div id="treatment"/>
      <div id="medicalTeam"/>
      <div id="location-map" />
      <ul className="medical-list">
        <HospitalMedicalItem
          description="진료과목"
          imgSrc={staticUrl('/static/images/icon/icon-hospital-subject.png')}
        >
          <TextArea
            ref={register}
            name="subject_text"
            placeholder="내과, 안과, 소아과, 피부과 등 진료 과목을 입력해 주세요."
          />
        </HospitalMedicalItem>
        <HospitalMedicalItem
          description="전문분야"
          imgSrc={staticUrl('/static/images/icon/icon-hospital-expertise.png')}
        >
          <TextArea
            ref={register}
            name="expertise"
            placeholder="침, 추나, 척주질환 등 전문분야를 입력해 주세요."
          />
        </HospitalMedicalItem>
        <HospitalMedicalItem
          description="진료시간 및 휴진여부"
          imgSrc={staticUrl('/static/images/icon/icon-hospital-time.png')}
        >
          <p>※ 한의원의 정기 휴진 요일을 클릭하세요.</p>
          <TimeRangeTable
            isEdit
            defaultTimeList={defaultTimeList}
            callback={({timeList}) => {
              setValue('timeList', timeList);
            }}
          />
          <TextArea
            ref={register}
            name="no_accept_text"
            placeholder="공휴일 및 비정기 휴진에 대한 여부를 입력해 주세요."
          />
        </HospitalMedicalItem>
        <HospitalMedicalItem
          description="예약 및 안내"
          imgSrc={staticUrl('/static/images/icon/icon-hospital-reservation.png')}
        >
          <TextArea
            ref={register}
            name="reservation_text"
            placeholder="예약 가능 여부 및 방법을 입력해 주세요."
          />
        </HospitalMedicalItem>
        <HospitalMedicalItem
          description="의료진"
          imgSrc={staticUrl('/static/images/icon/icon-hospital-medicalteam2.png')}
        >
          <span
            onClick={() => setDoctorTabOpen(curr => !curr)}
            className={cn('pointer', {toggle: doctorTabOpen})}
          >
            {doctorTabOpen ? '접기' : '펼쳐보기'}
            <img
              src={staticUrl('/static/images/icon/arrow/icon-medicalteam-fold.png')}
              alt="펼쳐보기/접기"
            />
          </span>
          {doctorTabOpen && (
            <ProfileJobForm
              initialData={(type !== 'ADD' && !isEmpty(myHospital)) && myHospital[myId][slug]}
              onChangeJobForm={jobForm => setJobForm(jobForm as any)}
              onRightBtnClick={data => {
                const myProfile = profile[myId];
                const hasEdu = !isEmpty(myProfile) && !isEmpty(myProfile.edu.ids);

                if (!hasEdu) {
                  alert('학력은 필수 입력 항목입니다.');
                  return null;
                }

                if (type === 'ADD') {
                  confirm('저장하시겠습니까?') && (
                    dispatch(appendUserHospital(slug, data, () => {
                      alert('저장되었습니다.');
                    }))
                  )
                } else {
                  confirm('수정하시겠습니까?') && (
                    isEmpty(data)
                      ? alert('수정되었습니다.')
                      : dispatch(patchUserHospital(slug, myHospital[myId][slug].id, data, () => {
                        alert('수정되었습니다.');
                      }))
                  );
                }
              }}
              ableToDelete={false}
            />
          )}
        </HospitalMedicalItem>
        <HospitalMedicalItem
          description="찾아오시는 길"
          imgSrc={staticUrl('/static/images/icon/icon-hospital-map.png')}
        >
          <TextArea
            ref={register}
            name="directions"
            placeholder="버스 및 지하철 노선 등을 입력해 주세요."
          />
        </HospitalMedicalItem>
        <HospitalMedicalItem
          description="주차 가능 여부"
          imgSrc={staticUrl('/static/images/icon/icon-hospital-parking.png')}
        >
          <ul className="availability">
            <li>
              <Radio
                checked={can_park}
                onClick={() => setValue('can_park', true)}
              >
                가능
              </Radio>
            </li>
            <li>
              <Radio
                checked={!can_park}
                onClick={() => setValue('can_park', false)}
              >
                불가능
              </Radio>
            </li>
          </ul>
        </HospitalMedicalItem>
        <li>
          {address && (
            <StyledMapShower
              address={address}
              onChangePosition={({x, y}) => {
                setValue('map_location', [parseFloat(x), parseFloat(y)]);
              }}
            />
          )}
        </li>
      </ul>
      <div>
        <StyledButtonGroup
          leftButton={{
            children: '취소',
            onClick: () => {
              confirm('작성하신 내용은 저장되지 않습니다.\n취소하시겠습니까?') && (
                setIsOnBeforeunload(curr => ({
                  ...curr,
                  isOnBeforeUnload: false,
                  replaceUrl: '/hospital'
                }))
              );
            }
          }}
          rightButton={{
            children: '등록',
            onClick: handleSubmit(hospitalForm => {
              validateHospitalRegister({...hospitalForm, ...jobForm})
                .then((validForm: any) => {
                  // @ts-ignore
                  if (confirm('한의원을 등록하시겠습니까?\n\n※ 한의플래닛에 등록된 한의원의\n검색엔진 최적화에는 약 3 ~ 5일이 소요됩니다.')) {
                    const {tags, mainImg, banners, map_location, timeList, telephone, ...hospitalForm} = validForm;

                    hospitalForm.band_type = 'hospital';
                    hospitalForm.telephone = telephone.split("-").join("");
                    hospitalForm.coordinates = map_location;
                    hospitalForm.tag_ids = tags.map(({id}) => id);
                    hospitalForm.banners = [mainImg, ...banners]
                      .map(({id}, idx) => ({id, order: idx}));

                    forEach(Object.keys(timeList), key => {
                      hospitalForm[key] = timeList[key];
                    });

                    const api = type === 'ADD'
                      ? bandApi.create(hospitalForm)
                      : bandApi.partial_update(slug as string, hospitalForm);

                    api.then(({status, data: {result}}) => {
                      if (Math.floor((status) / 100) === 2) {
                        LocalCache.del(`band_${slug}_v2`);
                        alert(`한의원이 성공적으로 ${type === 'ADD' ? '등록' : '수정'}되었습니다.`);
                        setIsOnBeforeunload({
                          isOnBeforeUnload: false,
                          replaceUrl: `/band/${result.slug}`,
                        });
                      }
                    });
                  }
                })
                .catch(({message}) => alert(message));
            })
          }}
        />
      </div>
    </HospitalMedicalFormDiv>
  );
};

export default React.memo(HospitalMedicalForm);
