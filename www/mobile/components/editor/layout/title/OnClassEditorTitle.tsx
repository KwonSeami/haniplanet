import * as React from 'react';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import StyledBasicTitle from './basicEditor/style/StyledBasicTitle';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {useRouter} from 'next/router';
import {pickBandSelector} from '../../../../src/reducers/orm/band/selector';
import {RootState} from '../../../../src/reducers';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';
import BandApi from '../../../../src/apis/BandApi';
import {fetchBandThunk} from '../../../../src/reducers/orm/band/thunks';
import Loading from '../../../common/Loading';
import StyledEditorTitle from './basicEditor/style/StyledEditorTItle';
import Avatar from '../../../Avatar';
import {ONCLASS_MEMBER} from '../../../../src/constants/meetup';
import SelectBox from '../../../inputs/SelectBox';
import {$BORDER_COLOR, $GRAY, $TEXT_GRAY} from '../../../../styles/variables.types';
import CheckBox from '../../../UI/Checkbox1/CheckBox';

const StyledSelectBox = styled(SelectBox)`
  border-bottom: 0;
  display: inline-block;
  height: 42px;
  width: 170px;
  position: relative;
  
  p {
    font-size: 15px;
    margin: 13px 15px auto;
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
  right: 15px;
`;

const OnClassTitle = styled(StyledBasicTitle)`
  padding: 0;
  
  .title-input {
    width: 100%;
    min-height: 62px;
    height: max-content;
    margin-bottom: 25px;
    ${fontStyleMixin({
      size: 21, 
      color: $TEXT_GRAY, 
      weight: '300'
    })};
    border-width: 0;
    box-sizing: border-box;

    &::placeholder {
      color: #bbb;
    }
  }
  
  .onclass-status {
    margin-left: 2px;
    ${fontStyleMixin({
      size: 15,
      color: $GRAY,
    })};
  }
`;

const USER_EXPOSE_TYPE_MAP = {
  real: '실명',
  anon: '익명',
};

const NOTICE_CATEGORY = [
  {label: '공지', value: '공지'},
  {label: '학습자료', value: '학습자료'}
];

interface Props {
  defaultValue?: any;
  initialMenuTagId?: boolean;
}

const OnClassEditorTitle: React.FC<Props> = ({
  defaultValue,
}) => {
  // Form Context
  const methods = useFormContext();
  const {register, setValue, watch} = methods;
  const open_range = watch('open_range');
  const category = watch('category');
  const user_expose_type = watch('user_expose_type');
  const is_notice = watch('is_notice');

  // Router
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    query: {
      slug,
      timeline: timelineId
    }
  } = router;

  // State
  const {band, me} = useSelector(
    ({orm, system: {session: {id}}}: RootState) => ({
      band: pickBandSelector(slug)(orm) || {},
      me: pickUserSelector(id)(orm) || {} as any
    }),
    shallowEqual
  );

  const bandApi = useCallAccessFunc(access => new BandApi(access));
  const [contextPending, setContextPending] = React.useState(true);
  const {timelines, band_member_grade} = band || {};
  const isOwner = band_member_grade !== 'normal';
  const isNotice = ((timelines || []).filter(({id}) => id === timelineId)[0] || {}).name === '공지사항 및 학습자료실';

  // React Hook Form

  React.useEffect(() => {
    dispatch(fetchBandThunk(bandApi, slug))
  }, [slug]);
  React.useEffect(() => {
    // Value Register
    register({name: 'user_types', value: [me.user_type]});
    register({name: 'open_range', value: 'user_all'});
    register({name: 'is_notice', value: false});
    register({name: 'category', value: '공지'});
    register({name: 'user_expose_type', value: 'real'});

    setContextPending(false)
  }, [me.user_type]);

  React.useEffect(() => {
    if (!contextPending && !isEmpty(defaultValue)) {
      const category_name = defaultValue.category ? defaultValue.category.name : '공지';

      setValue('is_notice', defaultValue.is_notice);
      setValue('category', category_name);
    }
  }, [contextPending, defaultValue]);

  if (contextPending) return <Loading />;

  return (
    <StyledEditorTitle>
      {isNotice && (
        <>
          <StyledSelectBox
            option={NOTICE_CATEGORY}
            value={category}
            onChange={value => setValue('category', value)}
            placeholder="카테고리 선택"
          />
          <StyledCheckBox
            checked={is_notice}
            onChange={() => setValue('is_notice', !is_notice)}
          >
            중요글
          </StyledCheckBox>
        </>
      )}
      <OnClassTitle>
        <textarea
          name="title"
          ref={register}
          className="title-input"
          placeholder="제목을 작성해주세요."
          defaultValue={defaultValue?.title}
          maxLength={50}
          rows={2}
        />
        <Avatar
          size={22}
          src={me.avatar}
          userExposeType={user_expose_type}
          {...me}
        />
        <span className='onclass-status'>{ONCLASS_MEMBER[band_member_grade]}</span>
        {(!isNotice && !isOwner) && (
          <>
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
          </>
        )}
      </OnClassTitle>
    </StyledEditorTitle>
  );
};

export default OnClassEditorTitle;
