import * as React from 'react';
import slugify from 'slugify';
import debounce from 'lodash/debounce';
import BandApi from '../../apis/BandApi';
import useCallAccessFunc from '../session/useCallAccessFunc';
import useSaveApiResult from '../useSaveApiResult';
import usePrevious from '../usePrevious';
import {useSelector} from 'react-redux';
import {pickUserSelector} from '../../reducers/orm/user/selector';

type TUserExposeType = 'real' | 'nick' | 'anon';
interface IForm {
  user_expose_type: TUserExposeType | '';
  nick_name: string;
  category: HashId;
  name: string;
  slug: string;
  purpose: string;
  body: string;
  question1: string;
  question2: string;
}

const moaCreateForm = () => {
  // FormData 입력 부분 state
  const [formData, setFormData] = React.useState<IForm>({
    user_expose_type: '',
    nick_name: '',
    category: '',
    name: '',
    slug: '',
    purpose: '',
    body: '',
    question1: '',
    question2: ''
  });
  const {
    user_expose_type,
    nick_name,
    category,
    name,
    slug,
    purpose,
    body,
    question1,
    question2
  } = formData;
  // 유저 공개 타입의 상태를 저장하는 state
  const [tmpUserExposeType, setTmpUserExposeType] = React.useState<TUserExposeType | ''>('');
  const [isShowContent, setIsShowContent] = React.useState(false);
  const [alreadyCommunity, setAlreadyCommunity] = React.useState({ name: false, slug: false });

  const prevUserExposeType = usePrevious(user_expose_type);

  const { user: useMeData } = useSelector(({system, orm}) => ({
    user: pickUserSelector(system.session.id)(orm) || {} as any
  }));

  const validData: [boolean, Indexable] = React.useMemo(() => {
    if (!user_expose_type) {
      return [false, {errMsg: '커뮤니티 공개 설정을 입력해주세요'}];
    } else if (user_expose_type === 'nick' && !nick_name) {
      return [false, {errMsg: '닉네임을 입력해주세요'}];
    } else if (!category) {
      return [false, {errMsg: '카테고리를 선택해주세요'}];
    } else if (user_expose_type === 'nick' && nick_name.length < 3) {
      return [false, {errMsg: '닉네임을 3자 이상 입력해주세요'}];
    } else if (!name) {
      return [false, {errMsg: '커뮤니티명을 입력해주세요'}];
    } else if (!slug) {
      return [false, {errMsg: '도메인을 입력해주세요'}];
    } else if (!purpose) {
      return [false, {errMsg: '개설목적을 입력해주세요'}];
    } else if (!body) {
      return [false, {errMsg: '소개글을 입력해주세요'}];
    } else if (body.length < 50) {
      return [false, {errMsg: '소개글을 50자 이상 입력해주세요'}];
    } else if (!question1 || !question2) {
      return [false, {errMsg: '가입 질문을 입력해주세요'}];
    }

    const formData: Indexable = {
      band_type: 'moa',
      user_expose_type,
      category,
      name,
      slug,
      purpose,
      body,
      questions: [question1, question2]
    };

    if (user_expose_type === 'nick') {
      formData.nick_name = nick_name;
    }

    return [true, formData];
  }, [formData]);

  const bandApi: BandApi = useCallAccessFunc(access => access && new BandApi(access));
  const {resData: categoryList} = useSaveApiResult(() => bandApi && bandApi.category({band_type: 'moa'}));
  
  React.useEffect(() => {
    if (!!categoryList) {
      setFormData(curr => ({
        ...curr,
        category: (categoryList)[0].id
      }));
    }
  }, [categoryList]);

  React.useEffect(() => {
    if (!!prevUserExposeType) {
      setFormData(curr => ({
        ...curr,
        user_expose_type: '',
        nick_name: '',
        name: '',
        slug: '',
        purpose: '',
        body: '',
        question1: '',
        question2: ''
      }));
    }
  }, [user_expose_type]);

  const onChangeAtName = ({target: {name, value}}) => {
    setFormData(current => ({ ...current, [name]: value }));
  };// 카테고리 데이터를 하드 코딩으로 작성하면서 에러 발생하는 부분을 수정하였습니다.

  const checkCommunity = React.useCallback((key: 'name' | 'slug', q) => {
    bandApi && bandApi.retrieve(key, {q})
      .then(({data: {result}}) => {
        !!result && setAlreadyCommunity(curr => ({
          ...curr,
          [key]: result.is_exist
        }));
      });
  }, []);

  const changeSlugifyStr = React.useCallback((query: string, callback: (str: string) => void) => {
    const slugifyStr = slugify(query, {
      replacement: '-',
      remove: null,
      lower: true
    });

    callback(slugifyStr);
  }, []);

  const debounceCheckCommunity = React.useCallback(debounce(checkCommunity, 300), []);
  const debounceChangeSlugifyStr = React.useCallback(debounce(changeSlugifyStr, 300), []);

  const changeCommunityName = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeAtName(e);
    debounceCheckCommunity('name', e.target.value);
  };

  const changeCommunitySlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {target: {value}} = e;

    onChangeAtName(e);
    debounceChangeSlugifyStr(value, (slug) => {
      debounceCheckCommunity('slug', slug);
      setFormData(curr => ({...curr, slug}));
    });
  };

  const applyUserExposeType = () => {
    if (!tmpUserExposeType) {
      alert('커뮤니티 공개 설정 타입을 선택해주세요');
      return null;
    }
    if (isShowContent) {
      confirm('작성하신 신청서는 저장되지 않습니다. 변경하시겠습니까?');
    }
    setIsShowContent(true);
    setFormData(curr => ({
      ...curr,
      user_expose_type: tmpUserExposeType
    }));
  };

  const createMoa = () => {
    const isCreate = confirm('개설 신청하시겠습니까?');

    if (!isCreate) { return null; }
    if (!validData[0]) {
      alert((validData[1] as any).errMsg);
      return null;
    }

    return bandApi && bandApi.create(validData[1]);
  };

  return {
    formaDataState: {formData, setFormData},
    tmpUserExposeTypeState: {tmpUserExposeType, setTmpUserExposeType},
    alreadyCommunity,
    categoryList,
    isShowContent,
    useMeData,
    applyUserExposeType,
    changeCommunityName,
    changeCommunitySlug,
    createMoa,
    onChangeAtName
  };
};

export default moaCreateForm;
