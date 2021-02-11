import React from 'react';
import styled from 'styled-components';
import Button from '../../../../inputs/Button/ButtonDynamic';
import ResponsiveLi, {Div} from '../../../../UI/ResponsiveLi/ResponsiveLi';
import SelectBox from '../../../../inputs/SelectBox';
import VerticalTitleCardMobile from '../../../../UI/Card/VerticalTitleCardMobile';
import {StyledInput, IDoctalkSignupForm} from '../FormMobile';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $TEXT_GRAY} from '../../../../../styles/variables.types';
import {TDoctalkSignType} from '../../../../../pages/doctalk/signup';
import useCoordinates from '../../../../../src/lib/naverMap/useCoordinates';
import naverMapRequired from '../../../../../hocs/naverMapRequired';
import isEmpty from 'lodash/isEmpty';
import size from 'lodash/size';
import {getDaumAddress} from '../../../../../src/lib/daum/address';
import {fetchUserHospital} from '../../../../../src/reducers/hospital';
import {RootState} from '../../../../../src/reducers';

const StyledVerticalTitleCardMobile = styled(VerticalTitleCardMobile)`
  border-bottom: 1px solid ${$BORDER_COLOR};

  h2 {
    padding-bottom: 23px;
    ${fontStyleMixin({
      size: 18,
    })};
  }

  > ul li:last-child {
    padding-bottom: 0;
  }

  @media screen and (max-width: 680px) {
    padding: 10px 14px 30px;
  }
`;

const StyledSelectBox = styled(SelectBox)`
  height: 44px;

  p {
    ${fontStyleMixin({
      size: 13
    })};
      
    span {
      ${fontStyleMixin({
        size: 13,
        color: $TEXT_GRAY
      })};
    }
  }

  ul {
    margin-top: 3px;
    max-height: 145px;
    border-bottom: 1px solid ${$BORDER_COLOR};

    li {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 13px;

      &:last-child {
        border-bottom: 0;
      }
    }
  }
`;

const StyledResponsiveLi = styled(ResponsiveLi)`
  ${Div} {
    padding-left: 0;
  }

  .certification li {
    margin-bottom: 0;
  }
`;

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

const BasicHospitalInfoMobile: React.FC<Props> = React.memo(
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
      ({hospital, system: {session: {id}}}: RootState) => ({
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
    }, []);

    const setBasicRequiredForm = React.useCallback((hospital: IHospital) => {
      const {name, link, telephone} = hospital;

      const changedState = {
        hospital_name: name,
        link: link || '',
        telephone,
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
    }, []);

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
      <StyledVerticalTitleCardMobile title="한의원 정보">
        <ul>
          <StyledResponsiveLi>
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
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <StyledInput
              placeholder="사업자 등록번호를 입력해주세요"
              name="registration_number"
              value={registration_number}
              onChange={handleOnChangeHospitalFormData}
              disabled={signType === 'haniplanet'}
            />
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <StyledInput
              className="search-address"
              placeholder="검색을 통해 주소를 입력해주세요"
              readOnly
              value={road_address}
            />
            <Button
              size={{
                width: '113px',
                height: '44px'
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
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <StyledInput
              placeholder="지번 주소"
              readOnly
              value={jibun_address}
              disabled={signType === 'haniplanet'}
            />
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <StyledInput
              placeholder="상세 주소"
              name="detail_address"
              value={detail_address}
              onChange={handleOnChangeHospitalFormData}
              disabled={signType === 'haniplanet'}
            />
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <StyledInput
              placeholder="우편 번호"
              readOnly
              value={zip_code}
              disabled={signType === 'haniplanet'}
            />
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <StyledInput
              placeholder="홈페이지 주소를 입력해주세요"
              name="link"
              value={link}
              onChange={handleOnChangeHospitalFormData}
              disabled={signType === 'haniplanet' || !!DEFAULT_FILLED_UP_STATE.link}
            />
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <StyledInput
              placeholder="한의원 대표 전화번호를 입력해주세요"
              name="telephone"
              value={telephone}
              onChange={handleOnChangeHospitalFormData}
              disabled={signType === 'haniplanet' || !!DEFAULT_FILLED_UP_STATE.telephone}
            />
          </StyledResponsiveLi>
        </ul>
      </StyledVerticalTitleCardMobile>
    );
  }
);

BasicHospitalInfoMobile.displayName = 'BasicHospitalInfoMobile';
export default naverMapRequired(BasicHospitalInfoMobile);
