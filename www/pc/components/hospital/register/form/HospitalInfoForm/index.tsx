import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import HospitalCategory from '../../../common/category/HospitalCategory';
import HospitalInfoInput from './HospitalInfoInput';
import HospitalInfoFormDiv from './HospitalInfoFormDiv';
import Button from '../../../../inputs/Button/ButtonDynamic';
import TagList from '../../../../UI/tag/TagList';
import TagInput from '../../../../inputs/Input/TagInput';
import FileUploader from '../../../../inputs/FileUploader';
import BandApi from '../../../../../src/apis/BandApi';
import useCallAccessFunc from '../../../../../src/hooks/session/useCallAccessFunc';
import {staticUrl} from '../../../../../src/constants/env';
import {$BORDER_COLOR, $POINT_BLUE} from '../../../../../styles/variables.types';

const HospitalInfoForm = ({defaultMedicalField}) => {
  const fileUploaderRef = React.useRef<HTMLInputElement>(null);

  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const {register, setValue, watch} = useFormContext();
  const tags = watch('tags') || [];
  const mainImg = watch('mainImg') || {};

  return (
    <>
      <HospitalInfoFormDiv>
        <p><span>*</span>표시는 필수 입력 사항입니다.</p>
        <div className="hospital-title-content">
          <div className="thumb-area">
            <div onClick={() => fileUploaderRef.current.click()}>
              <FileUploader
                ref={fileUploaderRef}
                validate='VALIDATE_IMAGE'
                onChange={(file) => {
                  const form = new FormData();
                  form.append('banners', file);

                  bandApi.imageUpload(form)
                    .then(({data, status}) => {
                      if (status !== 201) {
                        alert('선택한 이미지는 최대 크기를 초과했습니다.');
                      } else {
                        const {result: {banners}} = data;
                        setValue('mainImg', banners[0])
                      }
                    });
                }}
              />
              {!isEmpty(mainImg) ? (
                <div
                  className="thumb is-image pointer"
                  style={{backgroundImage: `url("${mainImg.image}")`}}
                >
                  <img
                    className="add-main-image"
                    src={staticUrl('/static/images/icon/icon-add-square.png')}
                    alt="대표 이미지 수정하기"
                  />
                </div>
              ) : (
                <div className="thumb pointer">
                  <img
                    src={staticUrl('/static/images/icon/icon-add-image.png')}
                    alt="한의원 대표 이미지 등록하기"
                  />
                  <span>한의원 대표 이미지를 등록해 주세요.</span>
                </div>
              )}
            </div>
            <p>
              ※ Image 크기는 3:2 비율로 자동 조절됩니다. (픽셀 1000*600 권장)<br />
              ※ 파일은 이미지 파일 형식인 JPG, JPEG, GIF, PNP만 가능합니다.
            </p>
          </div>
          <div className="info-area">
            <ul>
              <li>
                <h3 className="must">상호명</h3>
                <HospitalInfoInput
                  type="text"
                  name="name"
                  ref={register}
                  maxLength={15}
                  className="hospital-name"
                  placeholder="상호명을 입력해주세요."
                />
              </li>
              <li>
                <h3 className="must">대표 키워드</h3>
                <TagList
                  tags={tags}
                  onClick={(id) => {
                    setValue('tags', tags.filter(item => item.id !== id));
                  }}
                />
                <TagInput
                  className="tag-input"
                  placeholder="대표 키워드를 입력해주세요. (최대 5개) (예시 : 강남역한의원)"
                  onSelect={(tag: ITag) => {
                    if (tags.length < 5 && !tags.some(({name}) => name === tag.name)) {
                      setValue('tags', [...tags, tag]);
                    }
                  }}
                />
              </li>
              <li>
                <h3 className="must">주소</h3>
                <div>
                  <HospitalInfoInput
                    type="text"
                    name="address"
                    ref={register}
                    className="address-search"
                    placeholder="검색을 통해 주소를 입력해주세요."
                    readOnly
                  />
                  <Button
                    className="search-address"
                    size={{width: '64px', height: '34px'}}
                    font={{size: '14px', weight: '600', color: $POINT_BLUE}}
                    border={{radius: '0', width: '1px', color: $BORDER_COLOR}}
                    backgroundColor= "#f9f9f9"
                    onClick={() => {
                      window.daum.postcode.load(() => {
                        new daum.Postcode({
                          oncomplete: ({roadAddress}) => {
                            setValue('address', roadAddress);
                          }
                        }).open();
                      });
                    }}
                  >
                    검색
                  </Button>
                </div>
                <HospitalInfoInput
                  type="text"
                  name="detail_address"
                  ref={register}
                  placeholder="상세 주소를 입력해주세요."
                />
              </li>
              <li>
                <h3 className="must">전화번호</h3>
                <HospitalInfoInput
                  type="text"
                  name="telephone"
                  ref={register}
                  placeholder="전화번호를 하이픈(-) 형식으로 입력해주세요. (예시 : 02-0000–0000)"
                />
              </li>
              <li>
                <h3>홈페이지</h3>
                <HospitalInfoInput
                  type="text"
                  name="link"
                  ref={register}
                  placeholder="홈페이지 URL을 입력해주세요."
                />
              </li>
              <li>
                <h3 className="must">대표 분야</h3>
                <p>대표 진료분야는 최대 5개까지 선택이 가능합니다.</p>
                <HospitalCategory
                  defaultMedicalField={defaultMedicalField}
                  callback={medicalField => {
                    setValue('category_ids', medicalField.map(({id}) => id));
                  }}
                />
              </li>
            </ul>
          </div>
        </div>
      </HospitalInfoFormDiv>
    </>
  )
};

export default React.memo(HospitalInfoForm);