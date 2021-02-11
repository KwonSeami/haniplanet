import React from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import {USER_TYPE_TO_KOR} from '../../../src/constants/users';
import {useSelector, shallowEqual} from 'react-redux';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {useRouter} from 'next/router';
import {IUser} from '../../../src/@types/user';
import {RootState} from '../../../src/reducers';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$WHITE} from '../../../styles/variables.types';

const UserTypeToggleWrapper = styled.div`
  span {
    line-height: 21px;
    ${fontStyleMixin({
      size: 18,
      color: $WHITE,
      weight: 'bold'
    })};
    opacity: 0.5;

    & ~ span {

      &::before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        margin: 8px;
        height: 10px;
        border-left: 1px solid ${$WHITE};
        opacity: 0.3;
      }
    }

    &.on {
      opacity: 1;
    }
  }
`;

const UserTypeToggle = () => {
  const router = useRouter();

  const {me} = useSelector(
    ({
      orm,
      system: {session: {id}},
    }): RootState => ({
      me: pickUserSelector(id)(orm),
    }),
    shallowEqual
  );

  const {user_type} = me || {} as IUser;
  
  return user_type && (
    <UserTypeToggleWrapper
      onClick={() => router.replace({
        pathname: router.pathname,
        
      })}
    >
      <span
        className={cn({
          on: !isMyUserType
        })}
      >
        열린 공간
      </span>
      <span
        className={cn({
          on: isMyUserType
        })}
      >
        {USER_TYPE_TO_KOR[user_type]} 공간
      </span>
    </UserTypeToggleWrapper>
  );
};

export default React.memo(UserTypeToggle);
