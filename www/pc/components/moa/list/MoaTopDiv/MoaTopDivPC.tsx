import * as React from 'react';
import isEqual from 'lodash/isEqual';
import Link from 'next/link';
import {useSelector} from 'react-redux';
import ApplicatedMoaListPC from '../moaList/ApplicatedMoaList/ApplicatedMoaListPC';
import MyMoaListPC from '../moaList/MyMoaList/MyMoaListPC';
import {Div, LineSpan} from './styleCompPC';
import {staticUrl} from '../../../../src/constants/env';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';

const MoaTopDiv: React.FC = React.memo(
  () => {
    const {name} = useSelector(
      ({orm, system: {session: {id}}}) => (pickUserSelector(id)(orm) || {}),
      (prev, curr) => isEqual(prev, curr)
    );

    return (
      <Div className="clearfix">
        <div className="left-moa-box">
          <h2>
            <span>{name}</span>님의 MOA
            <LineSpan />
            <p>
              함께하는 너와 나, 우리! 모두 모아! 그룹을 위한 공간, MOA에서 시작하세요
            </p>
          </h2>
            <MyMoaListPC />
        </div>
        <p className="moa-guide">
          <Link href="/guide">
            <a>
              MOA 이용가이드
              <img
                src={staticUrl('/static/images/icon/icon-help-btn.png')}
                alt="MOA이용가이드"
              />
            </a>
          </Link>
        </p>
        <ApplicatedMoaListPC />
      </Div>
    );
  }
);

export default MoaTopDiv;
