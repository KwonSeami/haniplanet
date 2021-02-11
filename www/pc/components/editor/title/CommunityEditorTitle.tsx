import * as React from 'react';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import {shallowEqual, useSelector} from 'react-redux';
import styled from 'styled-components';
import Avatar from '../../Avatar';
import StyledBasicTitle from './StyledBasicTitle';
import {$BORDER_COLOR, $TEXT_GRAY, $FONT_COLOR} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {RootState} from '../../../src/reducers';
import CategorizedSelectBox from '../../inputs/CategorizedSelectBox';
import {TCommunityUserType} from '../../../src/reducers/categories';
import {USER_TYPE_TO_KOR} from '../../../src/constants/users';
import {TYPE_GRADIENT} from '../../community/common';
import {PROHIBITED_MENU_NAMES} from '../../../src/constants/community';
import {isCategoriesFetched} from '../../../src/lib/categories';
import CheckBox from '../../UI/Checkbox1/CheckBox';

const StyledCategorizedSelectBox = styled(CategorizedSelectBox)<{user_type: TCommunityUserType}>`
  border-bottom: 0;
  display: inline-block;
  height: 42px;
  width: 170px;
  position: relative;
  
  p {
    font-size: 15px;
    position: relative;
    text-decoration: underline;
    
    img {
      margin-left: 8px;
      right: auto;
    }
  }
  
  ul {
    left: -2px;
    margin-top: 0;
    max-height: 410px;
    
    li.selectbox-category {
      border: none;
      color: #fff;
      height: 30px;
      font-size: 12px;
      font-weight: 700;
      line-height: 18px;
      margin-top: -1px;
      padding: 6px 0;
      text-align: center;
      background: ${({user_type}) => TYPE_GRADIENT[user_type]};
    }

    li {
      background-color: #fff;
      border-top-width: 0;
      box-sizing: border-box;
      margin-top: 0px;
      overflow: hidden;
      padding: 0 21px 0 14px;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:first-child {
        border-top: 1px solid ${$BORDER_COLOR};
      }
    }
  }

  &::-ms-expand {
    display: none;
  }
`;

const StyledCheckBox = styled(CheckBox)`
  position: absolute;
  top: 19px;
  right: 30px;
`;

const StyledEditorTitle = styled.div`
  position: relative;
  padding: 19px 30px 21px;
  border-bottom: 1px solid ${$BORDER_COLOR};
  
  .select-box {
    height: 24px;
    margin-bottom: 10px;
    
    p {
      display: inline-block;
      font-size: 16px;
      height: inherit;
      line-height: 24px;
      text-decoration: none;

      &::after {
        content: '';
        position: absolute;
        bottom: 2px;
        left: 0;
        width: 100%;
        border-bottom: 1px solid ${$FONT_COLOR};
      }
    }

    ul {
      left: 0;
      margin-top: 10px;
    }
  }
  
  .title-input {
    height: 60px;
    width: 100%;
    margin-bottom: 27px;
    line-height: 30px;
    letter-spacing: -0.2px;
    ${fontStyleMixin({
      size: 21, 
      weight: '300'
    })};
    border-width: 0;
    box-sizing: border-box;
    overflow: hidden;
    
    &::placeholder {
      color: ${$TEXT_GRAY};
    }
  }
`;

const CommunityTitle = styled(StyledBasicTitle)`
  padding: 0;
`;

const USER_EXPOSE_TYPE_MAP = {
  real: '실명',
  nick: '닉네임',
  anon: '익명',
};

const CommunityEditorTitle: React.FC = () => {
  // State
  const [menus, setMenus] = React.useState([]);

  // React Hook Form
  const methods = useFormContext();
  const {register, setValue, watch} = methods;

  const menu_tag_id = watch('menu_tag_id');
  const user_expose_type = watch('user_expose_type');
  const open_range = watch('open_range');

  // Redux
  const {categories, me} = useSelector(
    ({categories, orm, system: {session: {id}}}: RootState) => ({
      categories,
      me: pickUserSelector(id)(orm) || {} as any
    }),
    shallowEqual
  );
  const {is_admin} = me || {};

  // categories 값으로 부터 머리말 목록을 생성
  React.useEffect(() => {
    if (isCategoriesFetched(categories) && !isEmpty(me)) {
      const {categoriesById, categoryIdsByUserType} = categories;
      const {user_type} = me;

      const defaultMenus = categoryIdsByUserType.default.reduce((prev, curr) => {
        const {name} = categoriesById[curr];

        if (!PROHIBITED_MENU_NAMES.includes(name)) {
          if (name !== '플래닛 PICK') {
            return [...prev, {label: name, value: curr}];
          }

          return me.is_admin
            ? [...prev, {label: name, value: curr}]
            : prev;
        }

        return prev;
      }, []);

      setMenus([
        {values: defaultMenus},
        {
          category: `${USER_TYPE_TO_KOR[user_type]}공간`,
          values: categoryIdsByUserType[user_type].map(id => ({
            label: categoriesById[id].name,
            value: id
          }))
        }
      ]);
    }
  }, [categories, me]);

  return (
    <StyledEditorTitle>
      <StyledCategorizedSelectBox
        options={menus}
        user_type={me.user_type}
        value={menu_tag_id}
        onChange={value => setValue('menu_tag_id', value)}
      />
      {is_admin && (
        <StyledCheckBox
          checked={open_range === 'only_me'}
          onChange={() => setValue(
            'open_range',
            open_range === 'only_me'
              ? 'user_all'
              : 'only_me'
          )}
        >
          나만 보기
        </StyledCheckBox>
      )}
      <textarea
        name="title"
        ref={register}
        className="title-input"
        placeholder="제목을 작성해주세요."
        maxLength={50}
        rows={2}
      />
      <CommunityTitle>
        <Avatar
          size={22}
          src={me.avatar}
          userExposeType={user_expose_type}
          {...me}
        />
        <ul>
          {Object.keys(USER_EXPOSE_TYPE_MAP).map(key => (
            <li
              className={cn({on: key === user_expose_type})}
              onClick={() => setValue('user_expose_type', key)}
            >
              {USER_EXPOSE_TYPE_MAP[key]}
            </li>
          ))}
        </ul>
        {user_expose_type === 'anon' && (
          <span>※ 익명의 글 작성 시, 수정/삭제가 불가능합니다.</span>
        )}
      </CommunityTitle>
    </StyledEditorTitle>
  );
};

export default CommunityEditorTitle;
