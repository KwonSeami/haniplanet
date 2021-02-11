import * as React from 'react';
import {DOCTALK_SUBJECTS} from '../../src/constants/hospital';
import SelectBox from '../inputs/SelectBox/SelectBoxDynamic';
import TagList from '../UI/tag/TagList';
import TagInput from '../inputs/Input/TagInput';
import ButtonGroup from '../inputs/ButtonGroup';
import {fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {$FONT_COLOR, $THIN_GRAY, $POINT_BLUE, $BORDER_COLOR, $TEXT_GRAY} from '../../styles/variables.types';
import {Responsiveli, StyledInput} from '../meetup/pcStyledComp';
import {isEmpty, isArray} from 'lodash';
import styled from 'styled-components';
import Radio from '../UI/Radio/Radio';
import cn from 'classnames';

interface IProps {
  initialData?: IDocTalkFaq;
  onSubmit: (formData: IDocTalkFaq) => void;
};

const StyledResponsiveli = styled(Responsiveli)`
  div {
    position: relative;
  }
  input {
    width: 100%;
    padding-right: 40px;
  }
  dl {
    display: table;
    table-layout: fixed;
    width: 100%;

    & ~ dl {
      margin-top: 10px;
    }

    dt, dd {
      position: relative;
      display: table-cell;
      vertical-align: middle;
    }

    dt {
      width: 100px;
      ${fontStyleMixin({
        size: 11,
        color: $FONT_COLOR
      })}
    }
  }
  input + i {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-style: normal;
    ${fontStyleMixin({
      size: 11,
      color: $TEXT_GRAY
    })};
  }

  .radio {
    display: inline-block;
    margin: 10px 0;
    margin-right: 30px;
  }

  .select-box.gray {
    p {
      color: ${$TEXT_GRAY};
    }
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

const StyleTextArea = styled.textarea`
  width: 100%;
  min-height: 380px;
  padding: 16px;
  border: 1px solid ${$BORDER_COLOR};
  line-height: 1.5;
  box-sizing: border-box;
  ${fontStyleMixin({
    size: 14,
    color: $FONT_COLOR
  })}
`

const USER_INFO_TEXT_MAX_LENGTH = 15;
const USER_INFO_TEXT_TOTAL_MAX_LENGTH = 128;

const AGE_OPTIONS = [
  {value: '신생아', label: '신생아'},
  {value: '소아', label: '소아'},
  {value: '초등학생', label: '초등학생'},
  {value: '중학생', label: '중학생'},
  {value: '고등학생', label: '고등학생'},
  {value: '10대후반', label: '10대후반'},
  {value: '20대초반', label: '20대초반'},
  {value: '20대중반', label: '20대중반'},
  {value: '20대후반', label: '20대후반'},
  {value: '30대초반', label: '30대초반'},
  {value: '30대중반', label: '30대중반'},
  {value: '30대후반', label: '30대후반'},
  {value: '40대초반', label: '40대초반'},
  {value: '40대중반', label: '40대중반'},
  {value: '40대후반', label: '40대후반'},
  {value: '50대초반', label: '50대초반'},
  {value: '50대중반', label: '50대중반'},
  {value: '50대후반', label: '50대후반'},
  {value: '60대초반', label: '60대초반'},
  {value: '60대중반', label: '60대중반'},
  {value: '60대후반', label: '60대후반'},
  {value: '70대초반', label: '70대초반'},
  {value: '70대중반', label: '70대중반'},
  {value: '70대후반', label: '70대후반'},
  {value: '80대초반', label: '80대초반'},
  {value: '80대중반', label: '80대중반'},
  {value: '80대후반', label: '80대후반'},
  {value: '90대초반', label: '90대초반'},
  {value: '90대중반', label: '90대중반'},
  {value: '90대후반', label: '90대후반'},
];

const FORM_VALIDATES = {
  category: {
    title: '카테고리',
    type: 'radio',
    required: true,
  },
  region: {
    title: '지역명',
    required: true
  },
  age_and_gender: {
    title: '나이/성별',
    required: false,
    callback: (value) => {
      const [age, gender] = (value || '/').split('/');
      if(!age) {
        return [false, '나이를 선택해주세요'];
      }
      if(!gender) {
        return [false, '성별을 선택해주세요'];
      }
    }
  },
  disease: {
    title: '질환명',
    required: true
  },
  question_title: {
    title: '질문 제목',
    required: true
  },
  question_body: {
    title: '질문 내용',
    required: true
  },
  answer: {
    title: '답변 내용',
    required: true
  },
  tag_ids: {
    title: '태그',
    required: false
  }
};

const isFormValidate = (formData) => {
  const dataArray = Object.keys(FORM_VALIDATES);
  
  for(let i = 0, length = dataArray.length; i < length; i++) {
    const key = dataArray[i];
    const field  = FORM_VALIDATES[key];
  
    if(field.required && isEmpty(formData[key])) {
      return [
        false,
        `${field.title || key}을(를) ${!!field.type && (field.type === 'radio' || field.type === 'checkbox') ? '선택' : '입력'}해주세요`
      ];
    }
    if(typeof field.callback === 'function') {
      const callbackResult = field.callback(formData[key], key);
      if(isArray(callbackResult)) {
        const [result, msg] = callbackResult;
        if(typeof result === 'boolean' && typeof msg === 'string') {
          return callbackResult;
        }
      }
    }
  }

  return [true, ''];
};

const DEFAULT_FORM_FIELDS = {
  category: '',
  region: '',
  age_and_gender: '',
  disease: '',
  question_title: '',
  question_body: '',
  answer: '',
  tag_ids: []
};

const FaqForm: React.FC<IProps> = ({
  initialData = DEFAULT_FORM_FIELDS,
  onSubmit
}) => {
  const [formData, setFormData] = React.useState<IDocTalkFaq>({
    ...initialData,
    category: initialData.category ? DOCTALK_SUBJECTS.filter(({label}) => label === initialData.category)[0].value : DOCTALK_SUBJECTS[0].value,
    tag_ids: initialData.tags ? initialData.tags : []
  });  
  
  const {
    category,
    region,
    age_and_gender,
    disease,
    question_title,
    question_body,
    answer,
    tag_ids,
  } = formData;

  const [age, gender] = React.useMemo(() => (age_and_gender || '/').split('/'), [age_and_gender]);

  const userInfoMaxLength = React.useMemo(() => {
    const maxLength = USER_INFO_TEXT_TOTAL_MAX_LENGTH - (region.length + disease.length);
    if(maxLength < question_title.length) {
      setFormData(curr => ({
        ...curr,
        question_title: question_title.substr(0, question_title.length - (question_title.length-maxLength))
      }))
    }
    return maxLength;
  }, [region, disease, question_title]);

  const submit = React.useCallback(() => {
    const [isValidate, msg] = isFormValidate(formData);
    if(!isValidate) {
      alert(msg);
    } else {
      onSubmit && onSubmit({
        ...formData,
        tag_ids: formData.tag_ids.map(({id}) => id)
      });
    }
  }, [formData, onSubmit])

  return (
    <>
      <ul>
        <StyledResponsiveli>
          <h3>카테고리</h3>
          <div>
            <SelectBox
              value={(DOCTALK_SUBJECTS.filter(({value}) => value == category) || DOCTALK_SUBJECTS)[0].value}
              option={DOCTALK_SUBJECTS}
              onChange={value => {
                setFormData(curr => ({
                  ...curr,
                  category: value
                }));
              }}
            />
          </div>
        </StyledResponsiveli>
        <StyledResponsiveli>
          <h3>질문자 정보</h3>
          <div>
            <dl>
              <dt>지역명</dt>
              <dd>
                <StyledInput
                  placeholder="지역명을 입력해주세요 (예시 : 강남)"
                  value={region}
                  maxLength={USER_INFO_TEXT_MAX_LENGTH}
                  onChange={({target: {value}}) => {
                    setFormData(curr => ({
                      ...curr,
                      region: value
                    }));
                  }}
                />
                <i>{region.length}/{USER_INFO_TEXT_MAX_LENGTH}</i>
              </dd>
            </dl>
            <dl>
              <dt>나이</dt>
              <dd>
                <SelectBox
                  className={cn({
                    gray: !age
                  })}
                  value={age}
                  placeholder={age || '연령대를 선택해주세요.'}
                  option={AGE_OPTIONS}
                  onChange={value => {
                    setFormData(curr => ({
                      ...curr,
                      age_and_gender: `${value}/${gender}`
                    }))
                  }}
                />
              </dd>
            </dl>
            <dl>
              <dt>성별</dt>
              <dd>
                <Radio
                  className="radio"
                  checked={gender === '남성'}
                  onClick={() => {
                    setFormData(curr => ({
                      ...curr,
                      age_and_gender: `${age}/남성`
                    }))
                  }}
                >
                  남성
                </Radio>
                <Radio
                  className="radio"
                  checked={gender === '여성'}
                  onClick={() => {
                    setFormData(curr => ({
                      ...curr,
                      age_and_gender: `${age}/여성`
                    }))
                  }}
                >
                  여성
                </Radio>
              </dd>
            </dl>
            <dl>
              <dt>질환명</dt>
              <dd>
                <StyledInput
                  placeholder="질환명을 입력해주세요 (예시 : 소화불량)"
                  value={disease}
                  maxLength={USER_INFO_TEXT_MAX_LENGTH}
                  onChange={({target: {value}}) => {
                    setFormData(curr => ({
                      ...curr,
                      disease: value
                    }))
                  }}
                />
                <i>{disease.length}/{USER_INFO_TEXT_MAX_LENGTH}</i>
              </dd>
            </dl>
          </div>
        </StyledResponsiveli>
        <StyledResponsiveli>
          <h3>질문 제목</h3>
          <div>
            <StyledInput
              placeholder="제목을 입력해주세요"
              value={question_title}
              maxLength={userInfoMaxLength}
              onChange={({target: {value}}) => {
                setFormData(curr => ({
                  ...curr,
                  question_title: value
                }))
              }}
            />
            <i>{question_title.length}/{userInfoMaxLength}</i>
          </div>
        </StyledResponsiveli>
        <StyledResponsiveli>
          <h3>질문 내용</h3>
          <div>
            <StyleTextArea
              value={question_body}
              onChange={({target: {value}}) => {
                setFormData(curr => ({
                  ...curr,
                  question_body: value
                }));
              }}
            >
              {question_body}
            </StyleTextArea>
          </div>
        </StyledResponsiveli>
        <StyledResponsiveli>
          <h3>태그입력</h3>
          <div className="input-box">
            <TagList
              tags={tag_ids}
              onClick={id => {
                setFormData(curr => ({
                  ...curr,
                  tag_ids: tag_ids.filter(({id: _id}) => _id !== id)
                }))
              }}
            />
            <TagInput 
              onSelect={({name, id}) => {
                if(tag_ids.length < 10) {
                  setFormData(curr => ({
                    ...curr,
                    tag_ids: [
                      ...tag_ids, 
                      {
                        name,
                        id
                      }
                    ]
                  }))
                } else {
                  alert('입력 가능한 태그 갯수를 넘었습니다.');
                }
              }} 
            />
          </div>
        </StyledResponsiveli>
        <StyledResponsiveli>
          <h3>답변 내용</h3>
          <div>
            <StyleTextArea
              value={answer}
              onChange={({target: {value}}) => {                  
                setFormData(curr => ({
                  ...curr,
                  answer: value
                }));
              }}
            >
              {answer}
            </StyleTextArea>
          </div>
        </StyledResponsiveli>
      </ul>
      <StyledButtonGroup
        leftButton={{
          children: '취소',
          onClick: () => history.back()
        }}
        rightButton={{
          children: '등록',
          onClick: () => submit()
        }}
      />
    </>
  )
}

export default React.memo(FaqForm);