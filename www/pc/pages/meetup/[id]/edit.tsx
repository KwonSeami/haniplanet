import * as React from 'react';
import styled from 'styled-components';
import Tabs, {useTabs} from '../../../components/UI/tab/Tabs';
import MeetupBasicInfoTabPC from '../../../components/meetup/meetupBasicInfoTab/MeetupBasicInfoTabPC';
import MeetupBodyTabPC from '../../../components/meetup/MeetupBodyTabPC';
import loginRequired from '../../../hocs/loginRequired';
import useTabContent from '../../../components/UI/tab/useTabContent';
import StoryApi from '../../../src/apis/StoryApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {useRouter} from 'next/router';
import Loading from "../../../components/common/Loading";
import useSetPageNavigation from '../../../src/hooks/useSetPageNavigation';
import {FormContext, useForm} from 'react-hook-form/dist/react-hook-form.ie11';
import isEmpty from 'lodash/isEmpty';
import has from 'lodash/has';
import Error from '../../_error';
import {defaultFormValues, formTimeTypes, localFormStructure, rangeFormatter} from '../../../src/constants/meetup/meetupForm';
import {object, string} from 'yup';
import userTypeRequired from '../../../hocs/userTypeRequired';
import {MAIN_USER_TYPES} from '../../../src/constants/users';

const Section = styled.section`
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  padding: 0 0 50px;
`;

const MeetupEditPC = React.memo(() => {
  const [pageLoading, setPageLoading] = React.useState(true);
  const [pageStatus, setPageStatus] = React.useState(403);

  const {currentTab, prev, next} = useTabs();
  const convertTabContent = useTabContent({prev, next});

  // React Hook Form
  const methods = useForm({
    defaultValues: defaultFormValues,
    validationSchema: object().shape({
      title: string().required()
    })
  });
  const {handleSubmit, register, setValue} = methods;

  // Router
  const router = useRouter();
  const {id} = router.query;

  // Api Hooks
  const storyApi: StoryApi = useCallAccessFunc(access => new StoryApi(access));

  // Form의 내용을 API로 Submit
  const onSubmit = data => {
    const today = new Date();

    const {
      avatar,
      body,
      category,
      progress_range,
      questions,
      receipt_range,
      tags,
      time,
      title,
      user_types,
      teacher_info,
      payment_info,
    } = data;

    const extension_fields = [
      'address',
      'capacity',
      'coordinates',
      'detail_address',
      'online_note',
      'products',
      'refund_policy',
      'region'
    ];

    const form = {
      body: body,
      category: category,
      extension: {
        // extension_fields에 포함된 key-value일 경우 spread
        ...extension_fields.map(i => {if (i in data) return {[i]: data[i]}}).reduce(((j, k) => Object.assign(j, k)), {}),
        progress_range: progress_range.map((i, idx) => rangeFormatter(i,
          [time[formTimeTypes[idx][0]], time[formTimeTypes[idx][1]]])),
        questions: questions.filter(q => (!!q && Object.values(q).some(v => v)) && q),
        receipt_range: receipt_range.map((i, idx) => rangeFormatter(i,
          [[today.getHours(), today.getMinutes()], ['23', '59']][idx])),
        ...(!avatar && {avatar_uid: ''}), // 이미지가 삭제되었을 경우 empty string
        teacher_info,
        payment_info,
      },
      file_uids: [],
      image_uids: [],
      open_range: 'user_all',
      tag_ids: tags.map(({id}) => id),
      title: title,
      user_types: user_types,
    };
    const formData = new FormData();

    if (!isEmpty(avatar) &&  has(avatar, 'file')) {
      formData.append('image', avatar.file);
    }

    // Story 업데이트 API
    const storyPartialUpdate = has(avatar, 'file')
      ? storyApi.upload('image', formData)
        .then(({data: {results}}) => {
          return storyApi.partial_update(id, {
            ...form,
            extension: {...form.extension, avatar_uid: results[0].uid}
          })
        })
      : storyApi.partial_update(id, form);

    storyPartialUpdate
      .then(({status}) => {
        if (Math.floor(status / 100) === 2) {
          alert('성공적으로 수정하였습니다.');
          router.push(`/story/${id}`);
        } else {
          throw '서버에서 오류가 발생했습니다. 관리자에게 문의해주세요.';
        }
      })
      .catch(e => console.error(e));
  };

  // Custom Hooks
  useSetPageNavigation('/meetup');

  // Life Cycle
  // Form 필드 등록 (register()) 및 데이터 초기화
  React.useEffect(() => {
    localFormStructure.map(i => register({name: i}));

    storyApi.retrieve(encodeURIComponent(id)).then(({data: {result = {} as any}, status}) => {
      if (!result.user.is_writer || result.extension.status === 'end') {
        setPageStatus(403);
      } else {
        setPageStatus(status);
      }

      if (result.extension.is_online_meetup) {
        setValue('online_note', result.extension.online_note);
      } else {
        setValue('address', result.extension.address);
        setValue('coordinates', result.extension.coordinates);
        setValue('detail_address', result.extension.detail_address);
        setValue('region', result.extension.region.id);
      }
      setValue('is_online_meetup', result.extension.is_online_meetup);
      setValue('avatar', result.extension.avatar.split('/').pop().startsWith('meetup-')
        ? null : result.extension.avatar);
      setValue('body_type', result.body_type);
      setValue('body', result.body);
      setValue('capacity', result.extension.capacity);
      setValue('category', result.extension.category);
      setValue('products', result.extension.products);
      setValue('teacher_info', result.extension.teacher_info);
      setValue('payment_info', result.extension.payment_info);
      setValue(
        'progress_range',
        [new Date(result.extension.progress_range[0]), new Date(result.extension.progress_range[1])]
      );
      setValue(
        'receipt_range',
        [new Date(result.extension.receipt_range[0]), new Date(result.extension.receipt_range[1])]
      );
      setValue('questions', [{}, {}].map((_, idx) => result.questions[idx] ? result.questions[idx] : {}));
      setValue('refund_policy', result.extension.refund_policy);
      setValue('tags', result.tags);
      setValue('time', {
        startHour: new Date(result.extension.progress_range[0]).getHours(),
        startMinute: new Date(result.extension.progress_range[1]).getMinutes(),
        endHour: new Date(result.extension.progress_range[1]).getHours(),
        endMinute: new Date(result.extension.progress_range[1]).getMinutes()
      });
      setValue('title', result.title);
      setValue('user_types', result.user_types);

      setPageLoading(false);
    });
  }, [id]);

  if (pageLoading) {
    return <Loading />;
  } else if (Math.floor(pageStatus / 100) > 2) {
    return <Error statusCode={pageStatus}/>
  }

  return (
    <Section>
      <FormContext {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs currentTab={currentTab}>
            {convertTabContent(MeetupBasicInfoTabPC, {edit: true})}
            {convertTabContent(MeetupBodyTabPC, {edit: true})}
          </Tabs>
        </form>
      </FormContext>
    </Section>
  );
});

MeetupEditPC.displayName = 'MeetupEditPC';
export default loginRequired(
  userTypeRequired(
    MeetupEditPC,
    MAIN_USER_TYPES
  )    
);
