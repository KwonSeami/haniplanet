import * as React from 'react';
import cn from 'classnames';
import {staticUrl} from '../src/constants/env';
import SelectBox from './inputs/SelectBox/SelectBoxDynamic';
import Input from './inputs/Input/InputDynamic';
import {pushPopup} from '../src/reducers/popup';
import RasisterNewItemPopup from './layout/popup/RegisterNewItemPopup';
import {useDispatch} from 'react-redux';
import ProfessorApi from '../src/apis/ProfessorApi';
import useCallAccessFunc from '../src/hooks/session/useCallAccessFunc';
import {SCHOOL_DICT} from './signup/currentComponent/form/basicInfo/BasicInfoPC';
import {useRouter} from 'next/router';
import styled from 'styled-components';
import {backgroundImgMixin, fontStyleMixin} from '../styles/mixins.styles';
import {$BORDER_COLOR, $FLASH_WHITE, $FONT_COLOR, $GRAY, $TEXT_GRAY, $WHITE} from '../styles/variables.types';

const AddNewList = styled.div`
  margin-bottom: 30px;

  & > p {
    margin-bottom: 8px;
    ${fontStyleMixin({
      size: 12,
      color: $GRAY
    })};
  }

  & > span {
    position: relative;
    display: block;
    width: 320px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    ${backgroundImgMixin({
      img: staticUrl('/static/images/banner/img-professor-add.png'),
    })};
    ${fontStyleMixin({
      size: 14,
      weight: 'bold',
      color: $WHITE
    })};

    img {
      position: absolute;
      top: calc(50% - 2px);
      right: 13px;
      width: 11px;
    }

    &.toggle {
      img {
        transform: rotate(180deg);
      }
    }
  }

  .inner-toggle {
    width: 320px;
    border: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;

    > div {
      padding: 10px 15px 16px;

      > p {
        ${fontStyleMixin({
          color: '#999',
        })};
      }

      .select-box {
        width: auto;
        padding: 0;
        margin: 4px 0;

        p img {
          right: 0;
          opacity: 0.3;
        }
      }

      .input {
        width: 100%;
        height: 44px;
        border-bottom: 1px solid ${$BORDER_COLOR};
        margin-bottom: 4px;
        ${fontStyleMixin({
          size: 14
        })};

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    span {
      display: block;
      height: 44px;
      text-align: center;
      line-height: 45px;
      background-color: ${$FLASH_WHITE};
      border-top: 1px solid ${$BORDER_COLOR};
      ${fontStyleMixin({
        size: 14,
        color: $TEXT_GRAY
      })};

      &.on {
        color: ${$FONT_COLOR};
      }
    }
  }
`;


const SCHOOL_LIST = SCHOOL_DICT.map((curr) => ({value: curr.label.slice(0,-2), label: curr.label}));

const ProfessorItemAdd = React.memo(() => {
  const router = useRouter();

  const dispatch = useDispatch();
  const professorApi: ProfessorApi = useCallAccessFunc(access => access && new ProfessorApi(access));

  const [toggle, setToggle] = React.useState(true);
  const [newProfessor, setNewProfessor] = React.useState({
    school: SCHOOL_LIST[0].value,
    name: '',
    major: '',
  });

  const inputValue = ({target: {name, value}}) => {
    setNewProfessor(curr => ({
      ...curr,
      [name]: value
    }));
  };

  return(
    <AddNewList>
      <p>
        아래 버튼으로 김원장넷 항목을 직접 등록 하실 수 있습니다.<br/>
        등록 후, 수정/삭제가 불가능하오니, 신중하게 등록 부탁드립니다!
      </p>
      <span
        onClick={() => setToggle(curr => !curr)}
        className={cn('ellipsis', 'pointer', {toggle})}
      >
        항목 등록
        <img
          src={staticUrl('/static/images/icon/arrow/icon-unfold-white.png')}
          alt="펼치기"
        />
      </span>
      {toggle && (
        <div className="inner-toggle">
          <div>
            <p>학교 선택 및 아래 내용을 입력해주세요.</p>
            <SelectBox
              option={SCHOOL_LIST}
              value={newProfessor.school}
              onChange={(school) => {
                setNewProfessor(curr => ({
                  ...curr,
                  school,
                }));
              }}
            />
            <Input
              name="name"
              onChange={inputValue}
              placeholder="교수명을 입력해주세요. (20자 이내)"
              maxLength={20}
            />
            <Input
              name='major'
              onBlur={inputValue}
              placeholder="학과명을 입력해주세요. (20자 이내)"
              maxLength={20}
            />
          </div>
          <span
            className={cn('pointer', {on: newProfessor.name !== ''})}
            onClick={() => {
              newProfessor.name !== ''
              && dispatch(pushPopup(RasisterNewItemPopup, {
                buttonGroupProps: {
                  rightButton: {
                    onClick: () => {
                      professorApi &&  professorApi.create({
                        title: newProfessor.name,
                        tags: [
                          newProfessor.school,
                          ...newProfessor.major !== '' ? [newProfessor.major] : []
                        ]
                      }).then(({status}) => {
                        if (status === 201) {
                          router.reload();
                        }
                      })
                    }
                  }
                }
              }));
            }}
          >
            등록
          </span>
        </div>
      )}
    </AddNewList>
  )
});

export default ProfessorItemAdd;