import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import {useSelector, shallowEqual} from 'react-redux';
import {RootState} from '../../../../src/reducers';
import {staticUrl} from '../../../../src/constants/env';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';
import Avatar from '../../../Avatar';
import {fontStyleMixin, radiusMixin} from '../../../../styles/mixins.styles';
import {$GRAY, $BORDER_COLOR} from '../../../../styles/variables.types';
import {useRouter} from 'next/router';

const SimpleWrite = styled.div`
  position: relative;
  box-sizing: border-box;
  background-color: #f0f2f8;
  height: 64px;
  padding: 20px 20px 25px 63px;
  margin-top: 15px;
  border-radius: 16px;

  .avatar > div {
    position: absolute;
    top: 11px;
    left: 15px;
    ${radiusMixin('50%', $BORDER_COLOR)};
  }
  
  p {
    margin: 0;
    ${fontStyleMixin({size: 14, color: $GRAY})};
  
    &::before {
      content: '';
      width: 20px;
      height: 20px;
      display: inline-block;
      vertical-align: -5px;
      background: url(${staticUrl('/static/images/icon/icon-write.png')}) 0 0 no-repeat;
      background-size: 20px 20px;
      text-indent: 20px;
    }
  }
`;

interface Props {
  url: string;
  asUrl?: string;
  className?: string;
  queryParams?: Indexable;
}

const WriteStory = React.memo<Props>(
  ({className, url, asUrl, queryParams}) => {
    const router = useRouter();
    const {avatar} = useSelector(
      ({system: {session: {id}}, orm}: RootState) => pickUserSelector(id)(orm),
      shallowEqual,
    ) || {avatar: null};

    return (
      <SimpleWrite
        className={cn('Write-story', className)}
        onClick={() => router.push(
          {pathname: url, query: queryParams},
          {pathname: asUrl, query: queryParams},
        )}
      >
        <Avatar
          hideUserName
          size={40}
          src={avatar}
          userExposeType={!!avatar && 'real'}
        />
        <p>자유롭게 글을 작성해주세요.</p>
      </SimpleWrite>
    );
  },
);

export default WriteStory;
