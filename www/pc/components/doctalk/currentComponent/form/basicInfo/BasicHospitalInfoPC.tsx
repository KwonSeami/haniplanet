import * as React from 'react';
import {
  StyledInput,
  StyledVerticalTitleCard,
  StyledSelectBox
} from './styleCompPC';
import ResponsiveLi from '../../../../UI/ResponsiveLi/ResponsiveLi';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {IDoctalkSignupForm} from '../FormPC';
import {fetchUserHospital} from '../../../../../src/reducers/hospital';
import {TDoctalkSignType} from '../../../../../pages/doctalk/signup';
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import useCoordinates from '../../../../../src/lib/naverMap/useCoordinates';
import naverMapRequired from '../../../../../hocs/naverMapRequired';
import Button from '../../../../inputs/Button/ButtonDynamic';
import {$FONT_COLOR, $BORDER_COLOR} from '../../../../../styles/variables.types';
import {getDaumAddress} from '../../../../../src/lib/daum/address';

interface Props {
  signType: TDoctalkSignType;
  form: Dig<IDoctalkSignupForm, 'hospitalInfo'>;
  dispatchSignupForm: React.Dispatch<any>;
}

let DEFAULT_FILLED_UP_STATE = {
  hospital_name: '',
  link: '',
  telephone: ''
};

const BasicHospitalInfoPC: React.FC<Props> = React.memo(
  ({signType, form, dispatchSignupForm}) => {
    // State
    const {
      hospital_name,
      registration_number,
      jibun_address,
      road_address,
      detail_address,
      zip_code,
      link,
      telephone
    } = form;

    const {lat, lng} = useCoordinates(road_address);

    // Redux
    const dispatch = useDispatch();

    const {hospital, myId} = useSelector(
      ({hospital, system: {session: {id}}}) => ({
        hospital,
        myId: id
      }),
      shallowEqual
    );

    // Variables
    const myHospital = hospital[myId];
    const hasOneHospital = size(myHospital) === 1;

    const handleOnChangeHospitalFormData = React.useCallback(({target: {name, value}}) => {
      dispatchSignupForm({type: 'KEY_FIELD', key: 'hospitalInfo', name, value});
    }, [dispatchSignupForm]);

    const setBasicRequiredForm = React.useCallback((hospital: IHospital) => {
      const {
        name,
        link,
        telephone
      } = hospital;

      const changedState = {
        hospital_name: name,
        link: link || '',
        telephone
      };

      DEFAULT_FILLED_UP_STATE = {
        ...DEFAULT_FILLED_UP_STATE,
        ...changedState
      };
      dispatchSignupForm({
        type: 'KEY_BULK_FIELD',
        key: 'hospitalInfo',
        values: changedState
      });
    }, [dispatchSignupForm]);

    React.useEffect(() => {
      if (myId) {
        dispatch(fetchUserHospital(myId));
      }
    }, [myId]);

    React.useEffect(() => {
      if (!isEmpty(myHospital) && hasOneHospital) {
        const [hospitalInfo] = Object.values(myHospital);
        setBasicRequiredForm(hospitalInfo);
      }
    }, [myHospital, hasOneHospital]);

    React.useEffect(() => {
      if (lat && lng) {
        dispatchSignupForm({
          type: 'KEY_BULK_FIELD',
          key: 'hospitalInfo',
          values: {
            latitude: lat,
            longitude: lng
          }
        });
      }
    }, [lat, lng]);

    return (
      <StyledVerticalTitleCard title="한의원 정보">
        <ul>
          <ResponsiveLi title="소속 한의원 이름">
            {(isEmpty(myHospital) || hasOneHospital) ? (
              <StyledInput
                placeholder="소속된 한의원 이름을 입력해주세요"
                name="hospital_name"
                value={hospital_name}
                onChange={handleOnChangeHospitalFormData}
                disabled={signType === 'haniplanet' || !!DEFAULT_FILLED_UP_STATE.hospital_name}
              />  
            ) : (
              <StyledSelectBox
                placeholder={<span>소속 한의원을 선택하세요</span>}
                option={Object.values(myHospital).map(({name}) => ({
                  label: name,
                  value: name
                }))}
                value={hospital_name}
                onChange={value => {
                  const hospitalInfo = myHospital[value];
                  setBasicRequiredForm(hospitalInfo);
                }}
              />
            )}
          </ResponsiveLi>
          <ResponsiveLi title="사업자 등록번호">
            <StyledInput
              placeholder="사업자 등록번호를 입력해주세요"
              name="registration_number"
              value={registration_number}
              onChange={handleOnChangeHospitalFormData}
              disabled={signType === 'haniplanet'}
            />
          </ResponsiveLi>
          <ResponsiveLi title="한의원 주소">
            <StyledInput
              className="search-address"
              placeholder="검색을 통해 주소를 입력해주세요"
              readOnly
              value={road_address}
            />
            <Button
              size={{
                width: '110px',
                height: '40px'
              }}
              font={{
                size: '13px',
                weight: '600',
                color: $FONT_COLOR
              }}
              border={{
                radius: '0',
                width: '1px',
                color: $BORDER_COLOR
              }}
              onClick={() => {
                getDaumAddress()
                  .then(({roadAddress, jibunAddress, zonecode, autoJibunAddress, autoRoadAddress}) => {
                    dispatchSignupForm({
                      type: 'KEY_BULK_FIELD',
                      key: 'hospitalInfo', 
                      values: {
                        road_address: roadAddress || autoRoadAddress,
                        jibun_address: jibunAddress || autoJibunAddress,
                        zip_code: zonecode
                      }
                    });
                  });
              }}
              disabled={signType === 'haniplanet'}
            >
              검색
            </Button>
          </ResponsiveLi>
          <ResponsiveLi>
            <StyledInput
              placeholder="지번 주소"
              readOnly
              value={jibun_address}
              disabled={signType === 'haniplanet'}
            />
          </ResponsiveLi>
          <ResponsiveLi>
            <StyledInput
              placeholder="상세 주소"
              name="detail_address"
              value={detail_address}
              onChange={handleOnChangeHospitalFormData}
              disabled={signType === 'haniplanet'}
            />
          </ResponsiveLi>
          <ResponsiveLi>
            <StyledInput
              placeholder="우편 번호"
              readOnly
              value={zip_code}
              disabled={signType === 'haniplanet'}
            />
          </ResponsiveLi>
          <ResponsiveLi title="한의원 홈페이지">
            <StyledInput
              placeholder="홈페이지 주소를 입력해주세요"
              name="link"
              value={link}
              onChange={handleOnChangeHospitalFormData}
              disabled={signType === 'haniplanet' || !!DEFAULT_FILLED_UP_STATE.link}
            />
          </ResponsiveLi>
          <ResponsiveLi title="한의원 대표전화">
            <StyledInput
              placeholder="한의원 대표 전화번호를 입력해주세요"
              name="telephone"
              value={telephone}
              onChange={handleOnChangeHospitalFormData}
              disabled={signType === 'haniplanet' || !!DEFAULT_FILLED_UP_STATE.telephone}
            />
          </ResponsiveLi>
        </ul>
      </StyledVerticalTitleCard>
    );
  }
);

BasicHospitalInfoPC.displayName = 'BasicHospitalInfoPC';
export default naverMapRequired(BasicHospitalInfoPC);
