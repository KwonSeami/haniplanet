import * as React from 'react';
import v4 from 'uuid/v4';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import RefundPolicyCard from './RefundPolicyCard';
import {Div, Responsiveli, StyledInput, SeminarBanner} from '../pcStyledComp';
import RegionApi from '../../../src/apis/RegionApi';
import SelectBox from '../../inputs/SelectBox/SelectBoxDynamic';
import {$POINT_BLUE, $GRAY, $BORDER_COLOR, $TEXT_GRAY, $THIN_GRAY} from '../../../styles/variables.types';
import Radio from '../../UI/Radio/Radio';
import TagInput from '../../inputs/Input/TagInput';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import ButtonGroup from '../../inputs/ButtonGroup';
import TimeInput from '../../inputs/Input/TimeInput';
import {DAY} from '../../../src/constants/times';
import {useRouter} from 'next/router';
import CustomDayPickerInput from '../../CustomDayPickerInput';
import TagList from '../../UI/tag/TagList';
import {MAIN_USER_TYPES} from '../../../src/constants/users';
import StyledButton from '../../profile/style/StyledButton';
import isEmpty from 'lodash/isEmpty';
import xor from 'lodash/xor';
import cn from 'classnames';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {MILLI_SECOND} from '../../../src/constants/times';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import {array, object, string} from 'yup';
import {isNumberInputValid} from '../../../src/lib/validates';
import {IPriceInfo} from '../../../src/@types/IMeetUp';

const StyledResponsiveLi = styled(Responsiveli)`
  .date-li {
    display: inline-block;
    vertical-align: middle;

    &:first-child::after {
      content: '';
      display: inline-block;
      margin: 0 6px;
      width: 8px;
      border-bottom: 1px solid ${$BORDER_COLOR};
    }
  }

  .time-li {
    display: inline-block;
    vertical-align: middle;

    li {
      margin-top: 10px;
      color: ${$TEXT_GRAY};
    }

    input {
      display: inline-block;
      vertical-align: middle;
      width: 53px !important;
      height: 44px;
      padding: 0;
      text-align: center;
      font-size: 14px;
    }
  }

  .address {
    input, button {
      margin-top: 10px;
    }

    input:disabled {
      opacity: 1;
    }
  }

  .tuition-li {
    position: relative;

    & + li {
      margin-top: 10px;
    }

    > div {
      display: inline-block;
    }

    .tuition-input {
      vertical-align: top;
      width: calc(100% - 132px);

      .select-box {
        display: inline-block;
        vertical-align: middle;
        width: 78px;
        margin-right: 10px;

        p {
          height: 43px;
        }
      }

      .input {
        vertical-align: middle;
      }
    }
  }

  .point-span {
    display: block;
    padding-top: 6px;
    ${fontStyleMixin({
      size: 11,
      color: $TEXT_GRAY
    })};
  }

  .tag-list {
    padding-left: 150px;
  }
`;

const DescriptionDiv = styled.div`
  padding: 15px 0 30px;
  border-bottom: 1px solid ${$BORDER_COLOR};

  h3 {
    padding-bottom: 9px;
    ${fontStyleMixin({
      size: 19,
      weight: '300'
    })};
  }

  & > article {
    border-radius: 2px;
    padding: 19px 16px;
    font-size: 13px;
    box-sizing: border-box;
    background-color: #f5f7f9;
  }

  h4 {
    padding-bottom: 7px;
    ${fontStyleMixin({
      size: 13,
      weight: 'bold'
    })};

    span {
      font-weight: bold;
      color: ${$POINT_BLUE};
    }
  }

  li {
    ${fontStyleMixin({
      size: 13,
      color: $GRAY
    })};
  }
`;

const StyledButtonGroup = styled(ButtonGroup)`
  padding: 30px 0 50px;
  text-align: right;

  li {
    padding: 0 5px;

    &:last-child {
      padding-right: 0;
    }
  }

  button {
    width: 138px;
    ${heightMixin(39)};
    border-radius: 19.5px;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid ${$THIN_GRAY};
    ${fontStyleMixin({
      size: 15,
      color: '#999'
    })};

    &.right-button {
      border-color: ${$POINT_BLUE};
      color: ${$POINT_BLUE};
    }
  }
`;

const Button = styled.button`
  display: block;
  width: 132px;
  height: 37px;
  font-size: 12px;
  font-weight: bold;
  border: 1px solid ${$BORDER_COLOR};
  cursor: pointer;

  &:first-child {
    margin-top: 7px;
  }

  & + button {
    margin-top: 17px;
  }

  img {
    display: inline-block;
    vertical-align: -4px;
    width: 16px;
    height: 17px;
    margin-right: 6px;
  }
`;

export const MeetupBasicInfoTextarea = styled.textarea`
  border: 1px solid #ddd;
  font-size: 14px;
  padding: 14px;
  box-sizing: border-box;
  
  &::placeholder {
    color: #bbb;
  }
  &:-ms-input-placeholder {
    color: #bbb;
  }
  &::-ms-input-placeholder {
    color: #bbb;
  }
`;

interface Props {
  className: string;
  edit?: boolean;
  next: () => void;
}

const LINE_TYPE_LIST = [
  {label: '오프라인 세미나/모임', value: 'offline'},
  {label: '온라인 세미나/모임', value: 'online'}
];

const MAX_PRICE_INFO_LENGTH = 5;

const MEMBER_TYPE_LIST = [
  {label: '한의사', value: 'doctor'},
  {label: '학생', value: 'student'},
  {label: '전체', value: 'all'},
];

const today = new Date();

const emptyProducts = ((
  user_types: Dig<IPriceInfo, 'user_types'> = ['doctor'],
  rest: Partial<IPriceInfo> = {},
): IPriceInfo => ({ id: v4(), user_types, text: '', price: '', name: '', ...rest }));

const convertUserType = (type: Array<'doctor' | 'student'>) => {
  if (isEmpty(xor(type, MAIN_USER_TYPES))) {
    return 'all';
  } else {
    return type[0];
  }
};

const MeetupBasicInfoTabPC: React.FC<Props> = ({
  className,
  edit,
  next,
}) => {
  const methods = useFormContext();
  const {formState: {dirty}, getValues, setValue, watch} = methods ;

  const address = watch('address');
  const capacity = watch('capacity');
  const detail_address = watch('detail_address');
  const online_note = watch('online_note');
  const products = watch('products');
  const progress_range = watch('progress_range');
  const receipt_range = watch('receipt_range');
  const refund_policy = watch('refund_policy');
  const tags = watch('tags');
  const time = watch('time');
  const user_types = watch('user_types');

  const [lineType, setLineType] = React.useState(!!online_note ? 'online' : 'offline');

  const regionApi: RegionApi = useCallAccessFunc(access => new RegionApi(access));

  const router = useRouter();

  const onSelectAutoTagList = React.useCallback((tag: any) => {
    const tags = getValues().tags;
    if (tags.length < 10 && !tags.some(({name}) => name === tag.name)) {
      setValue('tags', [...getValues().tags, tag]);
    }
  }, [getValues, setValue]);

  // 수강료의 객체 정보를 변경하는 함수
  const setPriceInfos = React.useCallback((key, id) => value => {
    setValue('products',
      getValues().products.map(i => i.id === id ? {...i, [key]: value} : i));
  }, [setValue, getValues]);

  // 오프라인 주소지의 좌표값을 받아오는 함수
  const getAddressCoordinates = (address: string) => {
    try {
      window.naver.maps.Service.geocode(
        {address},
        (status, response) => {
          if (status === window.naver.maps.Service.Status.ERROR) {
            return 'Error occurred.';
          }

          const {result: {items: {0: {point: {x, y}}}}} = response;

          setValue('coordinates', [parseFloat(x), parseFloat(y)]);
        },
      );
    } catch(e) {
      console.error(e);
      setTimeout(getAddressCoordinates, MILLI_SECOND * 500);
    }
  };

  // Life Cycle
  // 신청대상 변경 시 products 초기화
  React.useEffect(() => {
    const formValues = getValues();
    !isEmpty(formValues) && (!edit && formValues.products.every(({name, price}) => !name && !price))
      && setValue('products', user_types.map(type => emptyProducts([type])));
  }, [edit, user_types]);

  // 온/오프라인 변경 시 선택되지 않은 항목 입력값 초기화
  React.useEffect(() => {
    if (lineType === 'offline') {
      setValue('is_online_meetup', false);
      setValue('online_note', null);
    } else {
      setValue('is_online_meetup', true);
      setValue('address', null);
      setValue('coordinates', null);
      setValue('detail_address', null);
      setValue('region', null);
    }
  }, [lineType]);

  // 데이터의 형식이 올바른지 확인
  const isValidBasicInfoForm = object().shape({
    products: array().of(
      object().shape({
        price: string().required('수강료의 금액을 입력해 주세요.').ensure(),
        name: string().required('수강료의 구분을 입력해 주세요.').ensure()
      })
    ),
    address: string().when('online_note', {
      is: online_note => {return !(online_note)},
      then: string().required('장소를 입력해 주세요.').nullable()
    }).nullable(),
    time: object().shape({
      endMinute: string().required('모임일시를 입력해 주세요.').ensure(),
      endHour: string().required('모임일시를 입력해 주세요.').ensure(),
      startMinute: string().required('모임일시를 입력해 주세요.').ensure(),
      startHour: string().required('모임일시를 입력해 주세요.').ensure()
    }),
    capacity: string().required('모임정원을 입력해 주세요.').matches(/^[1-9]\d*$/g, '모임정원은 1명 이하일 수 없습니다').ensure(),
    receipt_range: array().compact().min(2, '신청기간을 입력해 주세요.'),
    progress_range: array()
      .compact()
      .min(2, '모일일시를 입력해 주세요.')
      .test(
        'progressRangeValidation',
        '모임 일시의 시작 시간이 종료 시간보다 늦을 수 없습니다.',
        () => {
          const {progress_range} = getValues();

          const [progress_start_at, progress_end_at] = [
            new Date(progress_range[0]),
            new Date(progress_range[1])
          ];

          progress_start_at.setHours(parseInt(time.startHour, 10), parseInt(time.startMinute, 10));
          progress_end_at.setHours(parseInt(time.endHour, 10), parseInt(time.endMinute, 10));

          return progress_start_at.getTime() <= progress_end_at.getTime();
        }
      ),
  });

  return React.useMemo(() => (
    <>
      <Helmet
        script={[{src: 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=83kvp4b50e&submodules=geocoder'}]}
      />
      <SeminarBanner>
        <h2>세미나/모임모집 기본정보</h2>
      </SeminarBanner>
      <Div className={className}>
        <ul>
          <StyledResponsiveLi>
            <h3>신청대상</h3>
            <div>
              <ul>
                {MEMBER_TYPE_LIST.map(({label, value}) => (
                  <li
                    key={`member-type-${value}`}
                    className="type-li"
                  >
                    <Radio
                      checked={convertUserType(user_types) === value}
                      onClick={() => !edit && setValue(
                        'user_types',
                        value === 'all'? MAIN_USER_TYPES : [value])
                      }
                    >
                      {label}
                    </Radio>
                  </li>
                ))}
              </ul>
            </div>
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <h3>신청기간</h3>
            <div className="input-box">
              <ul>
                <li className="date-li">
                  <CustomDayPickerInput
                    value={receipt_range[0]}
                    onDayChange={date => setValue(
                      'receipt_range',
                      (getValues().receipt_range || []).map((item, idx) => idx === 0 ? date : item),
                    )}
                    dayPickerProps={{
                      selectedDays: [receipt_range[0], receipt_range[1]],
                      disabledDays: {
                        after: receipt_range[1] || progress_range[0]
                          && new Date(progress_range[0].getTime() - DAY) || progress_range[1] || null,
                        before: today,
                      },
                      toMonth: receipt_range[1],
                      modifiers: {
                        start: receipt_range[0],
                        end: receipt_range[1],
                      },
                      numberOfMonths: 1,
                    }}
                    placeholder="0000.00.00"
                  />
                </li>
                <li className="date-li">
                  <CustomDayPickerInput
                    value={receipt_range[1]}
                    onDayChange={date => setValue(
                      'receipt_range',
                      (getValues().receipt_range || []).map((item, idx) => idx === 1 ? date : item),
                    )}
                    dayPickerProps={{
                      selectedDays: [receipt_range[0], receipt_range[1]],
                      disabledDays: {
                        before: receipt_range[0] || today,
                        after: progress_range[0] && new Date(progress_range[0] - DAY),
                      },
                      modifiers: {
                        start:receipt_range[0],
                        end: receipt_range[1],
                      },
                      month: receipt_range[0],
                      fromMonth: receipt_range[0],
                      numberOfMonths: 1,
                    }}
                    placeholder="0000.00.00"
                  />
                </li>
              </ul>
              <span className="point-span">
                ※ 신청기간은 세미나/모임모집 날짜 하루 전까지 지정 가능하며 종료일 기준시간은 23:59 입니다.
              </span>
            </div>
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <h3>모임정원</h3>
            <div className="input-box">
              <StyledInput
                name="capacity"
                numberOnly
                placeholder="000"
                style={{width: '53px'}}
                defaultValue={capacity}
                onBlur={({target: {value}}) => setValue('capacity', value)}
              /> 명
            </div>
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <h3>모임일시</h3>
            <div className="input-box">
              <ul>
                <li className="date-li">
                  <CustomDayPickerInput
                    value={progress_range[0]}
                    onDayChange={date => setValue(
                      'progress_range',
                      (getValues().progress_range || []).map((item, idx) => idx === 0 ? date : item),
                    )}
                    dayPickerProps={{
                      selectedDays: [progress_range[0], progress_range[1]],
                      disabledDays: {
                        after: progress_range[1] || null,
                        before: (receipt_range[1]
                          && new Date(receipt_range[1].getTime() + DAY)) || receipt_range[0] || today,
                      },
                      toMonth: progress_range[1],
                      modifiers: {
                        start: progress_range[0],
                        end: progress_range[1],
                      },
                      numberOfMonths: 1,
                    }}
                    placeholder="0000.00.00"
                  />
                </li>
                <li className="date-li">
                  <CustomDayPickerInput
                    value={progress_range[1]}
                    onDayChange={date => setValue(
                      'progress_range',
                      (getValues().progress_range || []).map((item, idx) => idx === 1 ? date : item),
                    )}
                    dayPickerProps={{
                      selectedDays: [progress_range[0], progress_range[1]],
                      disabledDays: {
                        before: progress_range[0] || (receipt_range[1] && new Date(receipt_range[1].getTime() + DAY)) || today,
                        after: null,
                      },
                      modifiers: {
                        start: progress_range[0],
                        end: progress_range[1],
                      },
                      month: progress_range[0],
                      fromMonth: progress_range[0],
                      numberOfMonths: 1,
                    }}
                    placeholder="0000.00.00"
                  />
                </li>
              </ul>
              <ul>
                <li className="time-li">
                  <TimeInput
                    time={time}
                    onChange={timeValue =>
                      isNumberInputValid(Object.values(timeValue)[0])
                        && setValue('time', {...getValues().time, ...timeValue})}
                  />
                </li>
              </ul>
            </div>
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <h3>{lineType === 'offline' ? '장소' : '문의관련'}</h3>
            <div className="address">
              <ul>
                {LINE_TYPE_LIST.map(({label, value}) => (
                  <li
                    key={`member-type-${value}`}
                    className="type-li"
                  >
                    <Radio
                      checked={lineType === value}
                      onClick={() => setLineType(value)}
                    >
                      {label}
                    </Radio>
                  </li>
                ))}
              </ul>
              {lineType === 'offline' ? (
                <>
                  <StyledInput
                    disabled
                    name="address"
                    placeholder="검색을 통해 세미나/모임의 모집 장소를 입력해주세요."
                    style={{width: '410px'}}
                    type="text"
                    value={address}
                    onChange={({target: {value}}) => setValue('address', value)}
                  />
                  <StyledButton
                    font={{size: '13px', weight: '600'}}
                    size={{width: '110px', height: '44px'}}
                    border={{radius: '0', width: '1px', color: $BORDER_COLOR}}
                    type="button"
                    onClick={() => {
                      window.daum.postcode.load(() => {
                        new daum.Postcode({
                          oncomplete: ({address, roadAddress, sido, sigungu}) => {
                            setValue(
                              'address',
                              roadAddress || address
                            );
                            getAddressCoordinates(roadAddress || address);
                            regionApi.retrieve().then((({data: {result}}) => {
                              const region = result.filter(({name}) => name === `${sido}/${sigungu}`);
                              !isEmpty(region) && setValue('region', region[0].id);
                            }));
                          }
                        }).open();
                      });
                    }}
                  >
                    변경
                  </StyledButton>
                  <StyledInput
                    name="detail_address"
                    placeholder="상세주소를 입력해주세요."
                    style={{width: '100%'}}
                    type="text"
                    defaultValue={detail_address}
                    onBlur={({target: {value}}) => setValue('detail_address', value)}
                  />
                </>
              ) : (
                <MeetupBasicInfoTextarea
                  style={{marginTop: '10px'}}
                  name="online_note"
                  placeholder="세미나/모임을 온라인에서 수강하는 상세 방법을 입력해주세요. (400자 이내)"
                  rows="5"
                  defaultValue={online_note}
                  onBlur={({target: {value}}) => setValue('online_note', value)}
                />
              )}
            </div>
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <h3>수강료</h3>
            <div className="input-box">
              <ul>
                {products.map(({id, user_types: userTypes, name, price}, idx) => {
                  const isLastPriceInfo = idx === products.length - 1;
                  const isUserTypeAll = user_types.length === MAIN_USER_TYPES.length;

                  return (
                    <li
                      key={id}
                      className="tuition-li"
                    >
                      <div className="tuition-input">
                        {isUserTypeAll && (
                          <SelectBox
                            className={cn((edit && id.length === 5) && 'disabled')}
                            disabled={edit && id.length === 5}
                            option={MEMBER_TYPE_LIST}
                            value={userTypes.length > 1 ? 'all' : userTypes[0]}
                            onChange={value =>
                              setPriceInfos('user_types', id)(value === 'all' ? MAIN_USER_TYPES : [value])
                            }
                          />
                        )}
                        <StyledInput
                          className={cn((edit && id.length === 5) && 'disabled')}
                          disabled={edit && id.length === 5}
                          name={`products[${idx}].name`}
                          placeholder={
                            isUserTypeAll
                              ? 'ex : 공보의, 군의관, 협회의원'
                              : '구분 (ex : 한의사, 학생)'
                          }
                          maxLength={15}
                          style={{ width: '166px', marginRight: '9px' }}
                          type="text"
                          defaultValue={name}
                          onBlur={({target: {value}}) => setPriceInfos('name', id)(value)}
                        />
                        <StyledInput
                          className={cn((edit && id.length === 5) && 'disabled')}
                          disabled={edit && id.length === 5}
                          name={`products[${idx}].price`}
                          numberOnly
                          placeholder=""
                          style={{ width: '87px' }}
                          defaultValue={products[idx].price}
                          onBlur={({target: {value}}) => setPriceInfos('price', id)(value)}
                        />원
                      </div>
                      <div className="add-button">
                        {(products.length > 1 && id.length !== 5) && (
                          <Button
                            type="button"
                            onClick={() => setValue('products', products.filter(i => i.id !== id))}
                          >
                            <img
                              src={staticUrl('/static/images/icon/icon-delete2.png')}
                              alt="삭제"
                            />
                            삭제하기
                          </Button>
                        )}
                        {isLastPriceInfo && products.length < MAX_PRICE_INFO_LENGTH && (
                          <Button
                            type="button"
                            style={{ color: `${$POINT_BLUE}` }}
                            onClick={() => setValue('products', [...products, emptyProducts(user_types)])}
                          >
                            <img
                              src={staticUrl('/static/images/icon/icon-plus.png')}
                              alt="추가"
                            />
                            추가하기
                          </Button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <span className="point-span">
                ※ 공중보건의, 공무원은 유료 세미나를 개설할 수 없습니다.
              </span>
            </div>
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <h3>환불정책</h3>
            <div>
              <RefundPolicyCard
                disabled={edit}
                type={refund_policy}
                onChange={refund_policy => {
                  setValue('refund_policy', refund_policy);
                }}
              />
            </div>
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <TagList
              tags={tags}
              onClick={(id) => {
                setValue('tags', getValues().tags.filter(item => item.id !== id));
              }}
            />
            <h3>태그입력</h3>
            <div className="input-box">
              <TagInput onSelect={onSelectAutoTagList} />
            </div>
          </StyledResponsiveLi>
        </ul>
        <DescriptionDiv>
          <h3>세미나/모임모집 개설안내</h3>
          <article>
            <h4 className="bold-600">
              접수방법 : <span className="bold-600">한의플래닛 접수</span>
            </h4>
            <ul>
              <li>- 개설 수수료 : 전체 수강료의 5%(후불결제)</li>
              <li>- 선택옵션 : 전화문의</li>
              <li>- 참여자 관리 : 한의플래닛</li>
              <li>- 결제수단 : 카드결제/카카오페이</li>
              <li>- 환불 문의 : 한의플래닛</li>
              <li>- 세미나 관련 CS 대응 : 세미나 개설자</li>
            </ul>
          </article>
        </DescriptionDiv>
        <StyledButtonGroup
          leftButton={{
            type: 'button',
            children: '취소',
            onClick: () => {
              confirm('세미나/모임모집 개설을 취소하시겠습니까?') && router.back();
            }
          }}
          rightButton={{
            type: 'button',
            children: '다음',
            onClick: () => isValidBasicInfoForm.validate(getValues())
              .then(() => next())
              .catch(({errors}) => alert(errors[0]))
          }}
        />
      </Div>
    </>
  ), [lineType, today, user_types, methods]);
};

export default React.memo(MeetupBasicInfoTabPC);
