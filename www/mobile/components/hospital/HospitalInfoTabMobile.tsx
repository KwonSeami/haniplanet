import * as React from 'react';
import cn from 'classnames';
import range from 'lodash/range';
import isEmpty from 'lodash/isEmpty';
import {useRouter} from 'next/router';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import Button from '../inputs/Button/ButtonDynamic';
import Radio from '../UI/Radio/Radio';
import TagList from '../UI/tag/TagList';
import Loading from '../common/Loading';
import TagInput from '../inputs/Input/TagInput';
import FileUploader from '../inputs/FileUploader';
import HospitalTimeTable from '../HospitalTimeTable';
import ProfileJobForm from '../profile/form/ProfileJobForm';
import HospitalMedicalFieldSelect from './HospitalMedicalFieldSelect';
import HospitalButtonGroup from './style/HospitalButtonGroup';
import TextArea from './style/TextArea';
import HospitalInput from './style/HospitalInput';
import StyledMapShower from './style/StyledMapShower';
import HospitalInfoDiv from './style/HospitalInfoDiv';
import BandApi from '../../src/apis/BandApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import useChangeInputAtName from '../../src/hooks/input/useChangeInputAtName';
import {ImageList} from '../inputs/ImageListUploader';
import {staticUrl} from '../../src/constants/env';
import {fetchUserHospital, appendUserHospital, patchUserHospital} from '../../src/reducers/hospital';
import {removeHospitalThunk} from '../../src/reducers/hospital';
import {fetchMedicalField} from '../../src/reducers/medicalField';
import {
  TImageIdsToDelete,
  IHospitalRegisterState,
  THospitalRegisterStatus,
  THospitalTotalState,
  IOnBeforeUnload,
} from '../../src/hooks/hospital/useHospitalRegister';
import {DEFAULT_DAY_OF_RECESS} from '../../src/hooks/hospital/useHospitalRegister';
import {$BORDER_COLOR, $FONT_COLOR, $GRAY, $WHITE} from '../../styles/variables.types';

const INITIAL_TABLE = {
  mon_start_at:'',
  tue_start_at:'',
  wed_start_at:'',
  thu_start_at:'',
  fri_start_at:'',
  sat_start_at:'',
  sun_start_at:'',
  mon_end_at:'',
  tue_end_at:'',
  wed_end_at:'',
  thu_end_at:'',
  fri_end_at:'',
  sat_end_at:'',
  sun_end_at:'',
};

interface Props {
  type: THospitalRegisterStatus;
  hospital: IHospitalRegisterState;
  setHospital: React.Dispatch<React.SetStateAction<IHospitalRegisterState>>;
  setIsOnBeforeunload: React.Dispatch<React.SetStateAction<IOnBeforeUnload>>;
  isValidForm: (form: {
    state: Partial<THospitalTotalState>,
    responseForm?: Partial<THospitalTotalState>,
    type: THospitalRegisterStatus
  }) => [boolean, (string | Partial<IHospitalRegisterState>)];
  image_ids_to_delete: TImageIdsToDelete;
  setImgIdsToDelete: React.Dispatch<React.SetStateAction<TImageIdsToDelete>>;
  registerHospital: (data: Partial<THospitalTotalState>, type: THospitalRegisterStatus) => void;
  responseForm: IHospitalRegisterState;
}

const FILED_MAX_SELECT = 5;
const IMAGE_MAX_ADD = 11;

const HospitalInfoTabMobile = React.memo<Props>(({
  type,
  next,
  hospital,
  registerHospital,
  setHospital,
  setIsOnBeforeunload,
  isValidForm,
  image_ids_to_delete,
  setImgIdsToDelete,
  responseForm
}) => {
  const {
    name,
    telephone,
    address,
    detail_address,
    directions,
    can_park,
    link,
    image,
    tags,
    subject_text,
    expertise,
    body,
    no_accept_text,
    reservation_text,
    recessDay,
  } = hospital;
  const changeHospitalState = useChangeInputAtName(setHospital);
  const allTagList = React.useMemo(() => [...tags], [tags]);

  // Router
  const router = useRouter();
  const {query: {slug}} = router;

  const dispatch = useDispatch();

  const onSelectAutoList = React.useCallback((tag: ITag) => {
    if (allTagList.length < 5 && !allTagList.some(({name}) => name === tag.name)) {
      setHospital(curr => ({...curr, tags: [...curr.tags, tag]}));
    }
  }, [allTagList]);

  const {medicalFieldList, myHospital, profile, myId} = useSelector((
    {medicalField, hospital, profile, system: {session: {id}}}) => ({
    medicalFieldList: medicalField,
    myHospital: hospital,
    myId: id,
    profile
  }), shallowEqual);

  const [medicalField, setMedicalField] = React.useState([]);
  const [openField, setOpenField] = React.useState(false);
  const fileUploaderRef = React.useRef<HTMLInputElement>(null);

  const [jobForm, setJobForm] = React.useState([]);

  const handleClickImageUpload = React.useCallback(() => {
    fileUploaderRef.current.click();
  }, []);

  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));
  React.useEffect(() => {
    if (myId) {
      !!myId && dispatch(fetchUserHospital(myId));
    }
  }, [myId]);

  // DidMount
  React.useEffect(() => {
    if (type === 'EDIT') {
      dispatch(fetchMedicalField());

      bandApi.retrieve(slug as string)
        .then(({data: {result}}) => {
          const {
            name,
            body,
            banners,
            members,
            tags,
            categories,
            extension: {
              telephone,
              work_day,
              partial,
              ...rest
            }
          } = result;

          // 휴진 요일 설정
          const _recessDay = {...DEFAULT_DAY_OF_RECESS};

          Object.keys(hospital.recessDay).forEach(day => {
            if (!(work_day[`${day}_start_at`] && work_day[`${day}_end_at`])) {
              _recessDay[day] = true;
            }
          });

          // 배너 이미지 설정
          const _image = banners.map(({id, image}) => ({id, image}));
          const _tags = tags.map(({tag})=> tag);

          setMedicalField(categories.map(({category: {id, name}}) => ({id, name})));

          setHospital(curr => ({
            ...curr,
            name,
            body,
            initialMember: {...members[0]},
            image: _image,
            medicalTime: work_day,
            recessDay: _recessDay,
            tags: _tags,
            telephone: telephone.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/,"$1-$2-$3").replace("--", "-"),
            ...rest
          }));
        });
    }
  }, [type, hospital]);

  React.useEffect(() => {
    setOpenField(false);
    setHospital(curr => ({...curr, category_ids: medicalField.map(curr => curr.id)}))
  },[medicalField]);

  const myProfile = profile[myId];
  const hasEdu = !isEmpty(myProfile) && !isEmpty(myProfile.edu.ids);

  const patchHospitalInfo = React.useCallback((data: Partial<THospitalTotalState>, responseForm: Partial<THospitalTotalState>, type: THospitalRegisterStatus) => {
    const [isValid, result] = isValidForm({state: data, type});

    if (isValid) {
      confirm('한의원을 수정하시겠습니까?\n\n※ 한의플래닛에 등록된 한의원의\n검색엔진 최적화에는 약 3 ~ 5일이 소요됩니다.') && (
        registerHospital(data as Partial<THospitalTotalState>, type)
      );
    } else {
      alert(result);
    }
  }, [isValidForm, registerHospital]);

  const [toggle, setToggle] = React.useState(false);

  if (type === 'EDIT' ? isEmpty(myHospital) : !myId) {
    return <Loading />;
  }

  return (
    <HospitalInfoDiv>
      {type === 'EDIT' && (
        <Button
          className="hospital-delete-btn"
          size={{width: '91px', height: '26px'}}
          font={{size: '12px', color: $FONT_COLOR}}
          border={{width: '1px', radius: '0', color: $BORDER_COLOR}}
          onClick={() => confirm('작성중인 내용이 있습니다.\n' + '이전 페이지로 이동하시겠습니까?')
            && dispatch(removeHospitalThunk(slug, () => {
              alert('삭제되었습니다.');
              router.replace('/hospital');
            }))
          }
        >
          <img
            src={staticUrl('/static/images/icon/icon-img-delete.png')}
            alt="한의원 삭제하기"
          />
          한의원 삭제
        </Button>
      )}
      <div>
        <h2>
          <span>01.</span> 기본정보
        </h2>
        <div className="hospital-images">
          <FileUploader
            maxLength={IMAGE_MAX_ADD}
            validate='VALIDATE_IMAGE'
            ref={fileUploaderRef}
            onChange={file => {
              const form = new FormData();
              form.append('banners', file);

              bandApi.imageUpload(form)
                .then(({data, status}) => {
                  if (status !== 201) {
                    alert('선택한 이미지는 최대 크기를 초과했습니다.');
                  } else {
                    const {result: {banners}} = data;
                    setHospital(curr => (
                      curr.image.length < IMAGE_MAX_ADD ? {
                        ...curr,
                        image: [...curr.image, ...banners],
                      } : curr
                    ));
                  }
                });
            }}
          />
          {isEmpty(image) ? (
            <div>
              <img
                src={staticUrl('/static/images/icon/icon-add-image.png')}
                alt="한의원 이미지 등록하기"
              />
              <p>한의원 이미지를 등록해 주세요.</p>
              <Button
                border={{width: '1px', color: $BORDER_COLOR}}
                size={{width: 'calc(100% - 30px)', height: '35px'}}
                font={{size: '12px', weight: 'bold', color: $FONT_COLOR}}
                backgroundColor={$WHITE}
                onClick={handleClickImageUpload}
              >
                이미지 등록
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-story-fold-arrow.png')}
                  alt="한의원 이미지 등록하기"
                />
              </Button>
            </div>
          ) : (
            <div>
              <ImageList>
                {image.map(({id, image}, idx) => (
                  <li key={id}>
                    <img
                      src={staticUrl("/static/images/icon/icon-delete-picture.png")}
                      alt="삭제하기"
                      onClick={() => {
                        // setImages(curr => curr.filter(item => item.result !== result));
                        //
                        // if (id && deleteCallback) {
                        //   deleteCallback(id);
                        // }
                      }}
                    />
                    <div
                      className="title-img-box"
                      style={{backgroundImage: `url("${image}")`}}
                    />
                    {idx === 0 && (
                      <span>대표</span>
                    )}
                  </li>
                ))}
                {(image.length < IMAGE_MAX_ADD) && (
                  <li
                    className="pointer"
                    onClick={handleClickImageUpload}
                  >
                    <img
                      className="add-btn"
                      src={staticUrl('/static/images/icon/icon-add-image.png')}
                      alt="추가하기"
                    />
                  </li>
                )}
              </ImageList>
              <span>{`${image.length} /11`}</span>
            </div>
          )}
          <p>
            ※ 첫번째 이미지가 대표이미지로 등록됩니다.<br />
            ※ 최소 1장 ~ 최대 10장까지 등록 가능 합니다.<br />
            ※ Image 크기는 3:2 비율으로 자동 조정됩니다. (픽셀 1000*600 권장)<br />
            ※ 파일은 이미지 파일 형식인 JPG, JPEG, GIF, PNP만 가능합니다.
          </p>
        </div>
        <ul className="hospital-info">
          <li>
            <h3 className="required">상호명</h3>
            <HospitalInput
              placeholder="상호명을 입력해주세요."
              name="name"
              value={name}
              onChange={changeHospitalState}
              maxLength={30}
            />
          </li>
          <li>
            <h3 className="required">대표 키워드</h3>
            <TagList
              tags={tags}
              onClick={(id) => setHospital(curr => ({
                ...curr,
                tags: tags.filter(item => item.id !== id),
              }))}
            />
            <TagInput
              className="tag-input"
              placeholder="대표 키워드를 입력해주세요. (최대 5개)"
              onSelect={onSelectAutoList}
            />
          </li>
          <li>
            <h3 className="required">주소</h3>
            <div className="address-box">
              <HospitalInput
                className="address-search"
                placeholder="검색을 통해 주소를 입력해 주세요."
                readOnly
                value={address}
              />
              <Button
                size={{width: '80px', height: '40px'}}
                font={{size: '14px', weight: '600', color: $GRAY}}
                border={{radius: '0', width: '1px', color: $BORDER_COLOR}}
                onClick={() => {
                  window.daum.postcode.load(() => {
                    new daum.Postcode({
                      oncomplete: ({roadAddress}) => {
                        setHospital(curr => ({
                          ...curr,
                          address: roadAddress
                        }));
                      }
                    }).open();
                  });
                }}
              >
                검색
              </Button>
            </div>
            <HospitalInput
              placeholder="상세 주소를 입력해 주세요."
              name="detail_address"
              value={detail_address}
              onChange={changeHospitalState}
            />
            {address && (
              <StyledMapShower
                address={address}
                onChangePosition={({x, y}) => {
                  setHospital(curr => ({
                    ...curr,
                    map_location: [parseFloat(x), parseFloat(y)]
                  }))
                }}
              />
            )}
          </li>
          <li>
            <h3 className="required">전화번호</h3>
            <HospitalInput
              placeholder="하이픈(-) 형식으로 입력해 주세요. (예시 : 02-0000–0000)"
              name="telephone"
              value={telephone}
              onChange={changeHospitalState}
            />
          </li>
          <li>
            <h3>홈페이지</h3>
            <HospitalInput
              placeholder="홈페이지 URL을 입력해주세요."
              name="link"
              value={link}
              onChange={changeHospitalState}
            />
          </li>
          <li>
            <h3 className="required">대표 분야</h3>
            <ul className="hospital-category">
              {range(FILED_MAX_SELECT).map(index =>
                (index < medicalField.length) ? (
                    <li className="on">
                      <img
                        src={medicalFieldList[medicalField[index].name].icons['normal']}
                        alt={medicalField[index].name}
                      />
                      <p>{medicalField[index].name}</p>
                      <button
                        type="button"
                        className="pointer"
                        onClick={() => setMedicalField(curr => curr.filter(item =>
                          item.id !== medicalField[index].id
                        ))}
                      >
                        <img
                          src={staticUrl('/static/images/icon/icon-delete-picture.png')}
                          alt="대표 진료분야 삭제하기"
                        />
                      </button>
                    </li>
                  ) : (
                    <li
                      className="pointer"
                      onClick={() => setOpenField(true)}
                    >
                      <img
                        src={staticUrl('/static/images/icon/icon-mini-plus.png')}
                        alt="대표 진료분야 추가하기"
                      />
                    </li>
                  )
              )}
            </ul>
            {openField && (
              <HospitalMedicalFieldSelect
                onApply={setMedicalField}
                categories={medicalField}
                maxLength={FILED_MAX_SELECT}
                isRegister
              />
            )}
          </li>
          <li>
            <h3 className="required">한의원 소개</h3>
            <TextArea
              placeholder="한의원 소개를 입력해 주세요."
              name="body"
              value={body}
              onChange={changeHospitalState}
            />
          </li>
        </ul>
      </div>

      <div>
        <h2>
          <span>02.</span> 진료정보
        </h2>
        <ul className="medical-info">
          <li>
            <h3 className="required">진료과목</h3>
            <TextArea
              placeholder="내과, 안과, 소아과, 피부과 등 진료 과목을 입력해 주세요."
              name="subject_text"
              value={subject_text}
              onChange={changeHospitalState}
            />
          </li>
          <li>
            <h3 className="required">진료분야</h3>
            <TextArea
              placeholder="침, 추나, 척주질환 등 전문분야를 입력해 주세요."
              name="expertise"
              value={expertise}
              onChange={changeHospitalState}
            />
          </li>
          <li>
            <h3 className="required">
              진료시간 및 휴진여부
              <span>※ 한의원의 정기 휴진 요일을 클릭하세요.</span>
            </h3>
            <div className="hospital-time">
              <HospitalTimeTable
                workDayObj={hospital.medicalTime || INITIAL_TABLE}
                isEdit
                type={type}
                recessDay={recessDay}
                setHospital={setHospital}
              />
            </div>
            <TextArea
              placeholder="공휴일 및 비정기 휴진에 대한 여부를 입력해 주세요."
              name="no_accept_text"
              value={no_accept_text}
              onChange={changeHospitalState}
            />
          </li>
          <li>
            <h3 className="required">예약 및 안내</h3>
            <TextArea
              placeholder="예약 가능 여부 및 방법을 입력해 주세요."
              name="reservation_text"
              value={reservation_text}
              onChange={changeHospitalState}
            />
          </li>
        </ul>
      </div>
      <div className="medical-team clearfix">
        <h2>
          <span>03.</span> 의료진
          <span
            onClick={() => setToggle(curr => !curr)}
            className={cn('pointer', 'fold-btn', {toggle})}
          >
            <img
              src={staticUrl('/static/images/icon/arrow/icon-medicalteam-fold.png')}
              alt="펼쳐보기/접기"
            />
          </span>
        </h2>
        {toggle && (
          <ProfileJobForm
            initialData={(type !== 'ADD' && !isEmpty(myHospital)) && myHospital[myId][slug]}
            onChangeJobForm={jobForm => setJobForm(jobForm)}
            onRightBtnClick={data => {
              if (hasEdu) {
                type === 'ADD'
                  ? confirm('저장하시겠습니까?') && (
                  dispatch(appendUserHospital(
                    slug,
                    data,
                    () => {
                      alert('저장되었습니다.');
                    }
                  ))
                ) : (
                  confirm('수정하시겠습니까?') && (
                    isEmpty(data) ? alert('수정되었습니다.')
                      : dispatch(patchUserHospital(
                      slug,
                      myHospital[myId][slug].id,
                      data,
                      () => {
                        alert('수정되었습니다.');
                      }))
                  ));
              } else {
                alert('학력은 필수 입력 항목입니다.');
              }
            }}
            ableToDelete={false}
          />
        )}
      </div>
      <div>
        <h2><span>04.</span> 추가 정보</h2>
        <ul>
          <li>
            <h3>찾아오시는 길</h3>
            <HospitalInput
              placeholder="버스 및 지하철 노선 등을 입력해 주세요."
              name="directions"
              value={directions}
              onChange={changeHospitalState}
            />
          </li>
          <li>
            <h3 className="required">주차 가능 여부</h3>
            <ul className="availability">
              <li>
                <Radio
                  checked={can_park}
                  onClick={() => setHospital(curr => ({
                    ...curr,
                    can_park: true
                  }))}
                >
                  가능
                </Radio>
              </li>
              <li>
                <Radio
                  checked={!can_park}
                  onClick={() => setHospital(curr => ({
                    ...curr,
                    can_park: false
                  }))}
                >
                  불가능
                </Radio>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <HospitalButtonGroup
        leftButton={{
          children: '취소',
          onClick: () => confirm('작성하신 내용은 저장되지 않습니다.\n취소하시겠습니까?') && (
            setIsOnBeforeunload(curr => ({
              ...curr,
              isOnBeforeUnload: false
            }))
          )
        }}
        rightButton={{
          children: '등록',
          onClick: () => {
            if (type === 'EDIT') {
              patchHospitalInfo({...hospital, ...jobForm}, responseForm, type);
            } else {
              const [isValid, validData] = isValidForm({state: hospital, type});

              if (!isValid) {
                alert(validData);
              } else {
                const {subject_list, self_introduce} = jobForm;

                // @ts-ignore
                setHospital(curr => ({...curr, ...validData}));

                if (isEmpty(subject_list)) {
                  alert('진료분야를 선택해주세요.');
                } else if (!self_introduce) {
                  alert('인사말을 입력해주세요.');
                } else {
                  confirm('한의원을 등록하시겠습니까?\n\n※ 한의플래닛에 등록된 한의원의\n검색엔진 최적화에는 약 3 ~ 5일이 소요됩니다.') && (
                    registerHospital({
                      ...hospital,
                      ...jobForm,
                    }, type)
                  );
                }
              }
            }
          }
        }}
      />
    </HospitalInfoDiv>
  );
});

HospitalInfoTabMobile.displayName = 'HospitalInfoTabMobile';

export default HospitalInfoTabMobile;
