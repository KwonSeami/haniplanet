import * as React from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import {shallowEqual, useSelector} from 'react-redux';
import {staticUrl} from '../../src/constants/env';
import {pickUserSelector} from '../../src/reducers/orm/user/selector';
import {backgroundImgMixin, fontStyleMixin} from '../../styles/mixins.styles';
import {$GRAY} from '../../styles/variables.types';
import Avatar from '../Avatar';
import {RootState} from "../../src/reducers";

const SimpleWrite = styled.div`
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  height: 70px;
  border-radius: 8px;
  background-color: #f0f2f8;
  padding: 23px 20px 25px 73px;

  .avatar {
    position: absolute;
    top: 14px;
    left: 20px;
  }
  
  p {
    height: 20px;
    cursor: pointer;
    ${fontStyleMixin({size: 15, color: $GRAY})};
  
    &::before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      width: 20px;
      height: 20px;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/icon-write.png'),
        size: '100%'
      })};
    }
  }
`;

interface Props {
  className?: string;
  url: string;
  queryParams?: any;
}

const WriteStory: React.FC<Props> = ({className, url, queryParams}) => {
  // Redux
  const {access, avatar} = useSelector(
    ({system: {session: {access, id}}, orm}: RootState) => ({
      access,
      avatar: (pickUserSelector(id)(orm) || {} as any).avatar,
    }),
    shallowEqual,
  );

  const onClickWriteFeedButton = React.useCallback(() => {
    if (!access) {
      // 현재 로그인하지 않은 사용자의 게시글 작성을 막습니다.
      alert('로그인 후 이용 가능합니다.');
    } else {
      Router.push({pathname: url, query: queryParams});
    }
  }, [access, url, queryParams]);

  return (
    <SimpleWrite
      className={className}
      onClick={onClickWriteFeedButton}
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
};

export default React.memo(WriteStory);
