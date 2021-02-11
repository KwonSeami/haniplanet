import * as React from 'react';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import {useRouter} from 'next/router';
import styled from 'styled-components';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import Avatar from '../../../../Avatar';
import Loading from '../../../../common/Loading';
import StyledCheckBox from './style/StyledCheckBox';
import StyledEditorTitle from './style/StyledEditorTitle';
import StyledBasicTitle from '../basicEditor/style/StyledBasicTitle';
import StyledCategorizedSelectBox from './style/StyledCategorizedSelectBox';
import {RootState} from '../../../../../src/reducers';
import {isCategoriesFetched} from '../../../../../src/lib/categories';
import {fetchCategoriesThunk} from '../../../../../src/reducers/categories';
import {pickUserSelector} from '../../../../../src/reducers/orm/user/selector';
import {PROHIBITED_MENU_NAMES} from '../../../../../src/constants/community';
import {MAIN_USER_TYPES, USER_TYPE_TO_KOR} from '../../../../../src/constants/users';

const CommunityTitle = styled(StyledBasicTitle)`
  padding: 0;
`;

const USER_EXPOSE_TYPE_MAP = {
  real: '실명',
  nick: '닉네임',
  anon: '익명',
};

interface Props {
  defaultValue?: any;
  initialMenuTagId?: boolean;
}

const CommunityEditorTitle: React.FC<Props> = ({
  defaultValue,
  initialMenuTagId,
}) => {
  // Form Context
  const methods = useFormContext();
  const {register, setValue, watch} = methods;
  const open_range = watch('open_range');
  const menu_tag_id = watch('menu_tag_id');
  const user_expose_type = watch('user_expose_type');

  // State
  const [menus, setMenus] = React.useState([]);
  const [contextPending, setContextPending] = React.useState(true);

  // Router
  const {query: {category}} = useRouter();

  // Redux
  const dispatch = useDispatch();
  const {categories, me} = useSelector(
    ({categories, orm, system: {session: {id}}}: RootState) => ({
      categories,
      me: pickUserSelector(id)(orm) || {} as any
    }),
    shallowEqual,
  );

  const {is_admin, user_type} = me || {} as any;

  React.useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, []);

  React.useEffect(() => {
    // Value Register
    register({name: 'menu_tag_id', value: ''});
    register({name: 'user_types', value: [me.user_type]});
    register({name: 'open_range', value: 'user_all'});
    register({name: 'user_expose_type', value: 'real'});

    setContextPending(false);
  }, [me.user_type]);

  React.useEffect(() => {
    if (!contextPending && !isEmpty(defaultValue)) {
      setValue('open_range', defaultValue.open_range);
    }
  }, [contextPending, defaultValue]);

  React.useEffect(() => { // menu list 값 저장
    if (isCategoriesFetched(categories) && !isEmpty(me)) {
      const {categoriesById, categoryIdsByUserType} = categories;
      const {user_type, is_admin} = me;

      const defaultMenus = categoryIdsByUserType.default.reduce((prev, curr) => {
        const {name} = categoriesById[curr];

        if (PROHIBITED_MENU_NAMES.includes(name)) {
          return prev;
        } else if (name !== '플래닛 PICK') {
          return [...prev, {label: name, value: curr}];
        }

        return is_admin
          ? [...prev, {label: name, value: curr}]
          : prev;
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

  React.useEffect(() => {
    if (isCategoriesFetched(categories)) {
      if (initialMenuTagId) {
        setValue('menu_tag_id', initialMenuTagId);
      } else {
        const {categoriesById, categoryIdsByUserType} = categories;
        const categoryIds = [
          ...categoryIdsByUserType.default,
          ...categoryIdsByUserType[user_type]
        ];

        // true:  접근 가능한 게시판
        // false: 공용 게시판의 첫번째 항목
        setValue('menu_tag_id', (
          !!category && !PROHIBITED_MENU_NAMES.includes(categoriesById[category].name) && categoryIds.some(id => id === category)
            ? category
            : categoryIdsByUserType.default.filter(key => categoriesById[key].name !== '플래닛 PICK')[0]
        ));
      }
    }
  }, [initialMenuTagId, categories, category, user_type]);

  React.useEffect(() => {
    if (isCategoriesFetched(categories) && !!menu_tag_id) {
      const categoryUserType = categories.categoriesById[menu_tag_id].user_type;

      setValue('user_types', (
        categoryUserType === 'default' ?
          MAIN_USER_TYPES :
          [user_type]
      ));
    }
  }, [categories, menu_tag_id, user_type]);

  if (contextPending) return <Loading />;

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
        defaultValue={defaultValue?.title}
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
