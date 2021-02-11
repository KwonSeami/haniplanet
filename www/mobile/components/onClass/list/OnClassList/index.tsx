import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import {useSelector, shallowEqual} from 'react-redux';
import OnClassListSlider from './OnClassListSlider';
import {staticUrl} from '../../../../src/constants/env';
import {StyledButtonGroup, NoContent, P} from './style';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';
import {RootState} from '../../../../src/reducers';

export type TCurrentTab = 'status' | 'member_status';

interface Props {
  currentTab: TCurrentTab;
  myOnClassList: any;
  changeCurrentTabStatus: () => void;
  changeCurrentTabMemberStatus: () => void;
}

const OnClassList: React.FC<Props> = ({
  currentTab,
  myOnClassList,
  changeCurrentTabStatus,
  changeCurrentTabMemberStatus,
}) => {
  // Redux
  const {signed_onclass_count, managing_onclass_count} = useSelector(
    ({orm, system: {session: {id}}}: RootState) => pickUserSelector(id)(orm) || {},
    shallowEqual
  );

  const isManageOnClass = currentTab === 'status';
  const currentOnClassList = React.useMemo(
    () => myOnClassList[currentTab].list,
    [myOnClassList, currentTab]
  );

  return (
    <div>
      <StyledButtonGroup
        on={currentTab}
        leftButton={{
          children:
            <>
              수강강의
              <span>{signed_onclass_count}</span>
            </>,
          onClick: changeCurrentTabMemberStatus,
        }}
        rightButton={{
          children:
            <>
              관리강의
              <span>{managing_onclass_count}</span>
            </>,
          onClick: changeCurrentTabStatus,
        }}
      />
      <P>
        체계적이고 퀄리티 있는<br/>
        온라인 강의 컨텐츠를 만나보세요!
      </P>
      {!isEmpty(currentOnClassList) ? (
        <OnClassListSlider
          myOnClassList={currentOnClassList}
          isManageOnClass={isManageOnClass}
        />
      ) : (
        <NoContent>
          <img
            className="no-content-img"
            src={isManageOnClass
              ? staticUrl('/static/images/icon/onclass-admin-null.png')
              : staticUrl('/static/images/icon/onclass-join-null.png')
            }
            alt="온라인강의가 없네요"
          />
          <h2>
            {isManageOnClass
              ? '아직 관리 중인 강의가 없네요'
              : '아직 수강신청한 강의가 없네요'}
          </h2>
          <p>
            {isManageOnClass
              ? '온라인강의를 만들어보세요!!'
              : '아래의 추천 강의를 신청해보세요!!'}
            <img
              src={staticUrl('/static/images/icon/icon-down-more.png')}
              alt="온라인 강의 소개 화살표"
            />
          </p>
        </NoContent>
      )}
    </div>
  );
};

export default React.memo(OnClassList);
