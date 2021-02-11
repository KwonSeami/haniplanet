import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {FormContext, useForm} from 'react-hook-form/dist/react-hook-form.ie11';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useApolloClient} from '@apollo/react-hooks';
import {useRouter} from 'next/router';
import ApolloDictPopup from '../../dict/ApolloDictPopup';
import CommunityEditorTitle from '../title/CommunityEditorTitle';
import EditorAdditionalContent from '../body/EditorAdditionalContent';
import EditorDictSVG from '../EditorDictSVG';
import EditorWrapper from '../body/EditorWrapper';
import ExploreApi from '../../../src/apis/ExploreApi';
import FollowMenu from '../../FollowMenu';
import HaniDynamicEditor from '../HaniDynamicEditor';
import Loading from '../../common/Loading';
import StoryApi from '../../../src/apis/StoryApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {createSendForm} from '../../../src/lib/editor/form';
import {HashId} from '../../../../../packages/types';
import {INFO_UPLOAD_WIKIS} from '../../../src/gqls/wiki';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {pushPopup} from '../../../src/reducers/popup';
import {RootState} from '../../../src/reducers';
import EditorBackBtn from '../body/EditorBackBtn';
import {staticUrl} from '../../../src/constants/env';
import {MAIN_USER_TYPES} from '../../../src/constants/users';
import {isCategoriesFetched} from '../../../src/lib/categories';
import {PROHIBITED_MENU_NAMES} from '../../../src/constants/community';
import {fetchCategoriesThunk} from '../../../src/reducers/categories';
import {TUserExposeType} from '../../../src/@types/user';
import debounce from 'lodash/debounce';
import xorBy from 'lodash/xorBy';
import {embedUrlCard, urlExtractor} from '../../../src/lib/editor/utils';

const HaniCommunityEditorBackground = styled.div`
  background: #f6f7f9;
  padding: 30px 0;
  
  .editor-bot-wrapper {
    padding-bottom: 36px;
    
    .embed-urlcard {
      margin-left: 0;
      margin-right: 0;
    }
  }
  
  .editor-wrapper {
    margin: 0 auto;
  }
`;

interface IEditorAttachList {
  file: [];
  image: [];
}

const EditorConfirmButtonGroup = styled.div`  
  button {
    width: 75px;
    height: 75px;
    background: #499aff;
    display: block;
    box-shadow: 1px 2px 6px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 4px;
    
    font-size: 15px;
    color: #fff;
    
    border 1px solid #eee;
    border-radius: 12px;
    
    cursor: pointer;
  }
  buttion:last-child {
    margin-bottom: 0px;
  }
  button[type=button] {
    background: #000;
  }
`;

interface Props {
  defaultData?: {
    title: string;
    body: string;
    tags: ITag[];
    wikis: any;
    defaultAttachList: {
      file: any;
      image: any;
    };
    menu_tag_id: string;
    open_range: 'user_all' | 'only_me';
    user_expose_type: TUserExposeType;
    url_card: string;
  }; // defaultData가 존재할 때 수정 게시글이라고 판단
  storyPK?: HashId;
}

const HaniCommunityEditor: React.FC<Props> = (({
  defaultData,
  storyPK
}) => {
  // State
  const [defaultEditorBody, setDefaultEditorBody] = React.useState(null);
  const [stateRegisterLoading, setStateRegisterLoading] = React.useState(true);
  const [initialized, setInitialized] = React.useState(!storyPK);

  const attachListState = React.useState<IEditorAttachList>({file: [], image: []});
  const [_, setAttachList] = attachListState;

  // Router
  const router = useRouter();
  const {
    query: {
      category
    }
  } = router;

  const dispatch = useDispatch();

  // Redux
  const {categories, me: {user_type}} = useSelector(
    ({categories, orm, system: {session: {id}}}: RootState) => ({
      categories,
      me: pickUserSelector(id)(orm) || {} as any
    }),
    shallowEqual
  );

  // React Hook Form
  const methods = useForm({
    defaultValues: {
      body: '',
      menu_tag_id: '',
      open_range: 'user_all',
      user_expose_type: 'real',
      additionalContent: {dictList: [], tags: []},
    },
  });
  const {getValues, handleSubmit, register, setValue, watch} = methods;
  const {menu_tag_id} = getValues();
  const {url_card} = watch('additionalContent');

  const client = useApolloClient();

  // API
  const exploreApi = useCallAccessFunc(access => new ExploreApi(access));
  const uploadApi = useCallAccessFunc(access => (
    (type: 'file' | 'image', file) => new StoryApi(access).upload(type, file)
  ));

  const debouncedEmbedUrlCard = React.useCallback(debounce(embedUrlCard, 300), [embedUrlCard]);

  const editorOnChange = React.useCallback(body => {
    setValue('body', body);
    initialized && debouncedEmbedUrlCard(methods);
  }, [initialized, methods, debouncedEmbedUrlCard]);

  React.useEffect(() => {
    register({name: 'excludedUrlList'});
    setValue('excludedUrlList', []);
  }, []);

  React.useEffect(() => {
    const defaultEditorBodyAsString = JSON.stringify(defaultEditorBody);

    if (!!defaultEditorBodyAsString) {
      setValue(
        'excludedUrlList',
        xorBy(
          [(url_card || {} as any).url],
          urlExtractor(defaultEditorBodyAsString) || []
        )
      );
      setInitialized(true);
    }
  }, [defaultEditorBody]);

  // 파일 uids 생성 함수
  const convertFileToUids = React.useCallback(
    (type: 'image' | 'file', file: File) => {
      const form = new FormData();
      form.append(type, file as File);

      return uploadApi(type, form)
        .then(({data: {results}}) => {
          if (!!results) {
            setAttachList(curr => ({...curr, [type]: [...curr[type], ...results]}));
            return type === 'image' ? results[0].image : null;
          }
        });
    }, [],
  );

  const fileConvertHandler = {
    file: file => convertFileToUids('file', file),
    image: image => convertFileToUids('image', image)
  };

  // 에디터 사용자 지정 버튼
  const editorCustomButton = [
    {
      name: '처방사전 첨부',
      element: <EditorDictSVG />,
      onClick: () => {
        dispatch(pushPopup(ApolloDictPopup, {
          setDictList: dict => {
            const {additionalContent} = getValues();

            setValue('additionalContent', {
              ...additionalContent,
              dictList: [
                ...additionalContent.dictList,
                dict,
              ],
            });
          },
        }));
      },
    }
  ];

  React.useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, []);

  React.useEffect(() => {
    register({name: 'additionalContent'});  // 태그 및 처방사전 데이터
    register({name: 'body'});   // 에디터 본문
    register({name: 'menu_tag_id'});  // 머리말
    register({name: 'open_range'}); // 공개범위 전체공개 | 나만보기
    register({name: 'user_types'}); // 유저 노출 유형
    register({name: 'user_expose_type'}); // 유저 노출 유형

    setStateRegisterLoading(false);
  }, [register]);

  // Select Box 기본값 지정
  React.useEffect(() => {
    if (!storyPK && isCategoriesFetched(categories)) {
      const {categoriesById, categoryIdsByUserType} = categories;

      setValue(
        'menu_tag_id',
        // ? 접근 가능한 게시판 : 공용 게시판의 첫번째 항목
        !!category && !PROHIBITED_MENU_NAMES.includes(categoriesById[category].name) && [
          ...categoryIdsByUserType.default,
          ...categoryIdsByUserType[user_type
        ]].some(id => id === category)
          ? category
          : categoryIdsByUserType.default.filter(key => categoriesById[key].name !== '플래닛 PICK')[0]
      );
    }
  }, [storyPK, categories, category, user_type]);

  // 현재 머리말의 user_type을 Form의 user_types로 번역
  React.useEffect(() => {
    if (isCategoriesFetched(categories) && !!menu_tag_id) {
      const categoryUserType = categories.categoriesById[menu_tag_id].user_type;

      setValue(
        'user_types',
        categoryUserType === 'default'
          ? MAIN_USER_TYPES
          : [user_type]
      );
    }
  }, [categories, menu_tag_id, user_type]);

  // storyPK가 있다면 스토리 수정으로 간주
  React.useEffect(() => {
    if (!stateRegisterLoading && !!defaultData) {
      const [_, setAttachList] = attachListState;

      const {
        title,
        body,
        tags,
        wikis,
        defaultAttachList,
        menu_tag_id,
        open_range,
        user_expose_type,
        url_card
      } = defaultData;

      setValue('title', title);
      setValue('menu_tag_id', menu_tag_id);
      setValue('open_range', open_range);
      setValue('user_expose_type', user_expose_type);

      setValue('additionalContent', {tags: tags || [], dictList: [], url_card});

      if (!isEmpty(wikis)) {
        client.query({query: INFO_UPLOAD_WIKIS, variables: {codes: wikis}})
          .then(({data: {wikis: {nodes}}}) => {
            const {additionalContent} = getValues();

            setValue('additionalContent', {
              ...additionalContent,
              dictList: [
                ...additionalContent.dictList,
                ...nodes
              ]
            });
          });
      }

      setDefaultEditorBody(JSON.parse(body));
      setAttachList(defaultAttachList);
    }
  }, [stateRegisterLoading, defaultData]);

  if (stateRegisterLoading) {
    return <Loading/>;
  }

  return (
    <HaniCommunityEditorBackground>
      <FormContext {...methods}>
        <EditorWrapper className="editor-wrapper">
          <FollowMenu
            top={0}
            right={-20}
            menuCompFn={() =>
              <EditorConfirmButtonGroup>
                <button
                  onClick={handleSubmit(data => {
                    if (confirm('작성하신 글을 등록하시겠습니까?')) {
                      const form = createSendForm(data, attachListState);

                      if (form) {
                        !!storyPK
                          ? exploreApi.updateStory(storyPK, {...form, menu_tag_id})
                            .then(({status}) => {
                              status === 200 && router.push(`/community/${storyPK}`);
                            })
                          : exploreApi.createStory({...form, menu_tag_id})
                            .then(({status}) => {
                              status === 201 && router.push(`/community${category ? `?category=${category}` : ''}`);
                            });
                      }
                    }
                  })}
                >
                  글 등록
                </button>
                <button
                  type="button"
                  onClick={() => confirm('글 작성을 취소하시겠습니까? 작성하신 글이 저장되지 않습니다.') && router.back()}
                >
                  취소
                </button>
              </EditorConfirmButtonGroup>
            }
          >
            <CommunityEditorTitle/>
            <HaniDynamicEditor
              customButton={editorCustomButton}
              defaultValue={defaultEditorBody}
              uploadHandler={fileConvertHandler}
              editorOnChange={editorOnChange}
            />
            <EditorAdditionalContent
              attachListState={attachListState}
              isCommunity={true}
              storyPK={storyPK}
            />
          </FollowMenu>
        </EditorWrapper>
      </FormContext>
      <EditorBackBtn
        className="back-button pointer"
        onClick={() => router.push(`/community${category ? `?category=${category}` : ''}`)}
      >
        <img
          src={staticUrl('/static/images/icon/arrow/icon-big-shortcuts.png')}
          alt="뒤로가기"
        />
        뒤로가기
      </EditorBackBtn>
    </HaniCommunityEditorBackground>
  );
});

export default HaniCommunityEditor;
