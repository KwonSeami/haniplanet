import * as React from 'react';
import Link from 'next/link';
import {useSelector, shallowEqual} from 'react-redux';
import {staticUrl} from '../../../../src/constants/env';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';
import OnClassList from '../OnClassList';
import {Div} from './style';

const OnClassTopDiv: React.FC = React.memo(
  () => {
    const {name} = useSelector(
      ({orm, system: {session: {id}}}) => (pickUserSelector(id)(orm) || {}),
      shallowEqual
    );

    return (
      <Div className="clearfix">
        <p className="moa-guide">
          <Link href="/guide">
            <a>
              나의 강의실 이용가이드
              <img
                src={staticUrl('/static/images/icon/icon-help-btn.png')}
                alt="나의 강의실 이용가이드"
              />
            </a>
          </Link>
        </p>
        <section className="onclass-list-wrapper">
          <h2>
            <span>{name}</span>님의 온라인 강의실
            <p>
              체계적이고 퀄리티 있는 온라인 강의 콘텐츠를 만나보세요!
            </p>
          </h2>
          <OnClassList/>
        </section>
      </Div>
    );
  }
);

export default OnClassTopDiv;
