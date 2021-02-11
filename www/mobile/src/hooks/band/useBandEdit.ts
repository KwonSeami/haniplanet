import * as React from 'react';
import BandApi from '../../apis/BandApi';
import useCallAccessFunc from '../session/useCallAccessFunc';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../reducers';
import {pickBandSelector} from '../../reducers/orm/band/selector';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import {fetchBandThunk, patchBandThunk} from '../../reducers/orm/band/thunks';
import {fetchQuestionThunk} from '../../reducers/question';
import {LocalCache} from 'browser-cache-storage';

interface IPatchForm {
  body: string;
  purpose: string;
  questions_map: {
    [key: string]: string;
  };
}

interface IEditForm {
  body: string;
  purpose: string;
  questions: {
    first: {
      question: string;
      id: string;
    },
    second: {
      question: string;
      id: string;
    }
  };
}

const useBandEdit = (slug: string) => {
  const dispatch = useDispatch();

  const [myInfo, setMyInfo] = React.useState({} as any);

  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const {band, question} = useSelector(
    ({question, orm}: RootState) => ({
      band: pickBandSelector(slug)(orm),
      question
    }),
    (prev, curr) => isEqual(prev, curr)
  );
  
  const getMyInfo = React.useCallback(() => {
    bandApi.me(slug)
      .then(({data: {result}}) => {
        result && setMyInfo(result);
      });
  }, [slug]);

  const patchBandInfo = React.useCallback((
    slug: string,
    currState: IEditForm,
    defaultState: IEditForm,
    callback: () => void
  ): void => {
    const [isValid, result] = isValidForm(currState, defaultState);

    if (isValid) {
      if (isEmpty(result)) {
        callback();
      } else {
        confirm('정보를 수정하시겠습니까?') && (
          dispatch(patchBandThunk(bandApi, slug, result, callback))
        );
      }
    } else {
      alert(result);
    }
  }, []);

  const isValidForm = React.useCallback((currState: IEditForm, defaultState: IEditForm): [
    boolean, (string | Partial<IPatchForm>)
  ] => {
    if (isEqual(currState, defaultState)) {
      return [true, {}];
    }

    const {
      purpose,
      body,
      questions: {
        first,
        second
      }
    } = currState;
    const {
      purpose: _purpose,
      body: _body,
      questions: {
        first: _first,
        second: _second
      }
    } = defaultState;

    let patchForm: Partial<IPatchForm> = {};

    if (purpose !== _purpose) {
      if (!purpose) {
        return [false, '개설목적을 입력해주세요.'];
      }

      patchForm = {...patchForm, purpose};
    }

    if (body !== _body) {
      if (body.length < 50) {
        return [false, '최소 50자의 소개글을 입력해주세요.'];
      }

      patchForm = {...patchForm, body};
    }

    if (!isEmpty(_first) && first.question !== _first.question) {
      if (!first.question) {
        return [false, '1번 가입질문을 입력해주세요.'];
      }

      patchForm = {
        ...patchForm,
        questions_map: {
          [first.id]: first.question
        }
      };
    }

    if (!isEmpty(_second) && second.question !== _second.question) {
      if (!second.question) {
        return [false, '2번 가입질문을 입력해주세요.'];
      }

      patchForm = {
        ...patchForm,
        questions_map: {
          ...patchForm.questions_map,
          [second.id]: second.question
        }
      };
    }

    return [true, patchForm];
  }, []);

  React.useEffect(() => {
    getMyInfo();
    LocalCache.del(`band_${slug}`);
    dispatch(fetchBandThunk(bandApi, slug));
    dispatch(fetchQuestionThunk(slug));
  }, [slug]);

  return {
    band,
    myInfo,
    question,
    patchBandInfo
  };
};

export default useBandEdit;
