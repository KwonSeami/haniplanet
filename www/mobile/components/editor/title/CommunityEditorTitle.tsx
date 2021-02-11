import * as React from 'react';
import styled from 'styled-components';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {staticUrl} from '../../../src/constants/env';
import {backgroundImgMixin, heightMixin} from '../../../styles/mixins.styles';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {dispatch as editorDispatch, onChangeEditorInputAtName, useGlobalState} from '../editorState';
import {$BORDER_COLOR, $POINT_BLUE, $FONT_COLOR} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import Avatar from '../../Avatar';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import {RootState} from '../../../src/reducers';
import {fetchCategoriesThunk, TCommunityUserType} from '../../../src/reducers/categories';
import {MAIN_USER_TYPES, USER_TYPE_TO_KOR} from '../../../src/constants/users';
import CategorizedSelectBox from '../../inputs/CategorizedSelectBox';
import {USER_TYPE_GRADIENT} from '../../community/common';
import {useRouter} from 'next/router';
import {isCategoriesFetched} from '../../../src/lib/categories';
import {HashId} from '../../../../../packages/types';
import {PROHIBITED_MENU_NAMES} from '../../../src/constants/community';
import CheckBox from '../../UI/Checkbox1/CheckBox';

const StyledEditorTitle = styled.div`
  padding: 22px 30px 24px;
  border-bottom: 1px solid #ddd;
  
  @media screen and (max-width: 680px) {
    margin: 0 15px;
    padding: 13px 0 14px;
  }
  
  .title-input {
    width: 100%;
    min-height: 62px;
    height: max-content;
    margin-bottom: 25px;
    ${fontStyleMixin({
      size: 21,
      weight: '300'
    })};
    border-width: 0;
    box-sizing: border-box;

    &::placeholder {
      color: #bbb;
    }
  }
`;

const StyledCategorizedSelectBox = styled(CategorizedSelectBox)<{user_type: TCommunityUserType}>`
  display: inline-block;
  height: 22px;
  width: 170px;
  position: relative;
  margin-bottom: 10px;
  border: none;
  
  @media screen and (max-width: 680px) {
    margin-bottom: 8px;
  }
  
  p {
    position: relative;
    display: inline-block;
    height: 23px !important;
    ${heightMixin(22)};
    font-size: 15px;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 3px;
      left: 0;
      width: 100%;
      border-bottom: 1px solid ${$FONT_COLOR};
    }
    
    img {
      top: 0;
      right: auto;
      margin: 0 0 0 4px;
      
      @media screen and (max-width: 680px) {
        margin-left: 4px;
      }
    }
  }
  
  ul {
    left: -2px;
    margin-top: 11px;
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
      background: ${({user_type}) => USER_TYPE_GRADIENT[user_type]};
    }
    li {
      margin-top: 0px;
      background-color: #fff;
      border-top-width: 0;
      box-sizing: border-box;
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
  position: relative;
  top: 0;
  right: 0;
`;

const StyledEditorTitleAvatar = styled.div`
  a {
    display: inline-block;
    margin: 0 6px 0 0;
    vertical-align: 0;
    ${fontStyleMixin({
      size: 15,
      weight: '600'
    })};
  }

  .cropped-image {
    vertical-align: middle;
    margin: -2px 6px 0 0;
  }

  ul {
    display: inline-block;

    li {
      display: inline-block;
      padding: 2px 8px 2px 6px;
      font-size: 12px;
      border-radius: 3px;
      border: 1px solid ${$BORDER_COLOR};
      box-sizing: border-box;
      cursor: pointer;

      & +li {
        margin-left: 3px;
      }

      &.on {
        padding: 2px 6px 1px 7px;
        color: ${$POINT_BLUE};
        border-color: ${$POINT_BLUE};

        &::before {
          content: '';
          display: inline-block;
          width: 10px;
          height: 12px;
          vertical-align: -2px;
          ${backgroundImgMixin({
            img: staticUrl('/static/images/icon/check/icon-editor-select.png')
          })};
        }
      }
    }
  }

  span {
    font-size: 11px;
    margin-left: 5px;
  }
`;

const USER_EXPOSE_TYPE_MAP = {
  real: '실명',
  nick: '닉네임',
  anon: '익명',
};

interface Props {
  storyPK: HashId;
}

export const onChangeMenuTagId = value => editorDispatch({type: 'FIELD', name: 'menu_tag_id', value});

const CommunityEditorTitle: React.FC<Props> = ({storyPK}) => {
  // State
  const [menus, setMenus] = React.useState([]);

  // Editor State
  const [menu_tag_id] = useGlobalState('menu_tag_id');
  const [open_range] = useGlobalState('open_range');
  const [title] = useGlobalState('title');
  const [user_expose_type] = useGlobalState('user_expose_type');

  // Router
  const {query: {category}} = useRouter();

  // Ref
  const titleInputRef = React.useRef();

  const handleTextareaOnChange = React.useCallback(e => {
    onChangeEditorInputAtName(e);

    titleInputRef.current.style.height = 'auto';
    titleInputRef.current.style.height = titleInputRef.current.scrollHeight + 'px';
  }, [titleInputRef]);

  const dispatch = useDispatch();

  const onChangeOpenRange = () => editorDispatch({
    type: 'FIELD',
    name: 'open_range',
    value: open_range === 'only_me'
      ? 'user_all'
      : 'only_me'
  });

  // Redux
  const {categories, me} = useSelector(
    ({
       categories,
       orm,
       system: {session: {id}
    }}: RootState) => ({
      categories,
      me: pickUserSelector(id)(orm) || {}
    }),
    shallowEqual
  );
  const {is_admin} = me;

  const {user_type} = me || {};

  React.useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, []);

  // Select Box 기본값 지정
  React.useEffect(() => {
    if (!storyPK && isCategoriesFetched(categories)) {
      const {categoriesById, categoryIdsByUserType} = categories;

      editorDispatch({
        type: 'FIELD',
        name: 'menu_tag_id',
        value: !!category && [...categoryIdsByUserType.default, ...categoryIdsByUserType[user_type]].some(id => id === category)
          ? category
          : categoryIdsByUserType.default.filter(key => categoriesById[key].name !== '플래닛 PICK')[0]
      })
    }
  }, [categories, category, storyPK, user_type]);

  React.useEffect(() => {
    if (!open_range) {
      editorDispatch({ // open_range 값이 설정되어 있지 않다면 기본값으로 지정
        type: 'FIELD',
        name: 'open_range',
        value: 'user_all'
      });
    }
  }, [open_range]);

  React.useEffect(() => {
    if (isCategoriesFetched(categories) && !!user_type) {
      const {categoriesById, categoryIdsByUserType} = categories;

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
      }, [me.is_admin]);

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
  }, [categories, user_type]);

  // 현재 머리말의 user_type을 Form의 user_types로 번역
  React.useEffect(() => {
    if (isCategoriesFetched(categories) && !!menu_tag_id) {
      const categoryUserType = categories?.categoriesById[menu_tag_id]?.user_type;

      editorDispatch({
        type: 'FIELD',
        name: 'user_types',
        value: categoryUserType === 'default'
          ? MAIN_USER_TYPES
          : [user_type]
      });
    }
  }, [categories, menu_tag_id, user_type]);

  React.useEffect(() => {
    (!isEmpty(menus) && !menu_tag_id) && onChangeMenuTagId(menus[0].id);
  }, [menu_tag_id, menus]);

  return (
    <StyledEditorTitle>
      <div>
        <StyledCategorizedSelectBox
          options={menus}
          user_type={me.user_type}
          value={menu_tag_id}
          onChange={onChangeMenuTagId}
        />
        {is_admin && (
          <StyledCheckBox
            checked={open_range === 'only_me'}
            onChange={onChangeOpenRange}
          >
            나만 보기
          </StyledCheckBox>
        )}
      </div>
      <textarea
        className="title-input"
        maxLength={50}
        name="title"
        placeholder="제목을 작성해주세요."
        ref={titleInputRef}
        value={title}
        onKeyPress={e => e.which === 13 && e.preventDefault()}
        onChange={handleTextareaOnChange}
      />
      <StyledEditorTitleAvatar>
        <Avatar
          size={22}
          userExposeType={user_expose_type}
          src={me.avatar}
          {...me}
        />
        <ul>
          {Object.keys(USER_EXPOSE_TYPE_MAP).map(key =>
            <li
              className={cn({on: key === user_expose_type})}
              onClick={() => editorDispatch({type: 'FIELD', name: 'user_expose_type', value: key})}
            >
              {USER_EXPOSE_TYPE_MAP[key]}
            </li>
          )}
        </ul>
      </StyledEditorTitleAvatar>
    </StyledEditorTitle>
  );
};

export default CommunityEditorTitle;
