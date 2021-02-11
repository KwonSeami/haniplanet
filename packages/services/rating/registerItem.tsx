//미완성되었습니다. 추후 필요한 모든 파일을 모듈화하는 작업이 핑료합니다.
import * as React from 'react';
import cn from 'classnames';
import useChangeInputAtName from '../../hooks/input/useChangeInputAtName';
import {useDispatch} from 'react-redux';
import {useRouter} from 'next/router';
import SelectBox from '../../components/SelectBox';
import Input from '../../components/input/input';
import {pushPopup} from '../../reducers/popup';
import ProfessorApi from '../../apis/ProfessorApi';
import useCallAccessFunc from '../../hooks/session/useCallAccessFunc';
interface IResisterProps {
  isProfessor?: boolean;
  imgSrc: string;
  bgImg: string;
}

export const SCHOOL_DICT = [
  {value: 'gcu', label: '가천대학교'},
  {value: 'ghu', label: '경희대학교'},
  {value: 'dhu', label: '대구한의대학교'},
  {value: 'dju', label: '대전대학교'},
  {value: 'dgu', label: '동국대학교'},
  {value: 'dsu', label: '동신대학교'},
  {value: 'deu', label: '동의대학교'},
  {value: 'bsu', label: '부산대학교'},
  {value: 'sju', label: '상지대학교'},
  {value: 'smu', label: '세명대학교'},
  {value: 'usu', label: '우석대학교'},
  {value: 'wgu', label: '원광대학교'},
];

const SCHOOL_LIST = SCHOOL_DICT.map((curr) => ({value: curr.label.slice(0,-2), label: curr.label}));

const RegisterItem = React.memo<IResisterProps>(({
  imgSrc
}) => {
  const [newProfessor, setNewProfessor] = React.useState({
    school: SCHOOL_LIST[0].value,
    name: '',
    major: '',
  });
  const [toggle, setToggle] = React.useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const professorApi: ProfessorApi = useCallAccessFunc(access => access && new ProfessorApi(access));

  return (
    <div className="professor-add">
      <p>
        아래 버튼으로 김원장넷 항목을 직접 등록하실 수 있습니다.
      </p>
      <span
        onClick={() => setToggle(curr => !curr)}
        className={cn('ellipsis', 'pointer', {toggle})}
      >
        항목 등록
        <img
          src={imgSrc}
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
              onChange={useChangeInputAtName}
              name={name}
            />
            <Input
              name='name'
              onBlur={useChangeInputAtName}
              placeholder="교수명을 입력해주세요. (20자 이내)"
              maxLength={20}
            />
            <Input
              name='major'
              onBlur={useChangeInputAtName}
              placeholder="학과명을 입력해주세요. (20자 이내)"
              maxLength={20}
            />
          </div>
          <span
            className={cn('pointer', {on: newProfessor.name !== ''})}
            onClick={() => {
              newProfessor.name !== ''
              && dispatch(pushPopup(RasisterNewItemPopup, {
                form: newProfessor,
                buttonGroupProps: {
                  rightButton: {
                    onClick: () => {
                      professorApi && professorApi.create({
                        title: newProfessor.name,
                        tags: [newProfessor.school, newProfessor.major]
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
    </div>
  )
  });

export default RegisterItem;