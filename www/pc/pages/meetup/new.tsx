import * as React from 'react';
import styled from 'styled-components';
import Tabs, {useTabs} from '../../components/UI/tab/Tabs';
import MeetupCommissionTabPC from '../../components/meetup/MeetupCommissionTabPC';
import MeetupBasicInfoTabPC from '../../components/meetup/meetupBasicInfoTab/MeetupBasicInfoTabPC';
import MeetupBodyTabPC from '../../components/meetup/MeetupBodyTabPC';
import MeetupOptionTabPC from '../../components/meetup/MeetupOptionTabPC';
import MeetupCompleteTabPC from '../../components/meetup/MeetupCompleteTabPC';
import loginRequired from '../../hocs/loginRequired';
import useTabContent from '../../components/UI/tab/useTabContent';
import useSetPageNavigation from '../../src/hooks/useSetPageNavigation';
import {FormContext, useForm} from 'react-hook-form/dist/react-hook-form.ie11';
import MeetupApi from '../../src/apis/MeetupApi';
import StoryApi from '../../src/apis/StoryApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import isEmpty from 'lodash/isEmpty';
import has from 'lodash/has';
import {defaultFormValues, formTimeTypes, localFormStructure, rangeFormatter} from '../../src/constants/meetup/meetupForm';
import {IOptionState} from '../../src/@types/IMeetUp';
import compact from 'lodash/compact';
import userTypeRequired from '../../hocs/userTypeRequired';
import {MAIN_USER_TYPES} from '../../src/constants/users';

const Section = styled.section`
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  padding: 0 0 50px;
`;

const MeetupNewPC = () => {
  // Custom Hooks
  useSetPageNavigation('/meetup');

  const {currentTab, prev, next} = useTabs();
  const convertTabContent = useTabContent({prev, next});

  const optionState = React.useState<IOptionState>({
    itemById: {},
    items: [],
  });

  // React Hook Form
  const methods = useForm({
    defaultValues: defaultFormValues,
  });
  const {getValues, handleSubmit, register} = methods;

  // Api Hooks
  const meetupApi: MeetupApi = useCallAccessFunc(access => new MeetupApi(access));
  const storyApi: StoryApi = useCallAccessFunc(access => new StoryApi(access));

  // Form의 내용을 API로 Submit
  const onSubmit = data => {
    const today = new Date();

    const {
      address,
      avatar,
      body,
      capacity,
      category,
      coordinates,
      detail_address,
      is_online_meetup,
      online_note,
      teacher_info,
      payment_info,
      options,
      products,
      progress_range,
      questions,
      receipt_range,
      refund_policy,
      region,
      tags,
      time,
      title,
      user_types
    } = data;

    const form = {
      body: body,
      capacity: capacity,
      category: category,
      ...(!isEmpty(options) && {options: options}),
      products: products,
      refund_policy: refund_policy,
      title: title,
      user_types: user_types,
      open_range: 'user_all',
      teacher_info,
      payment_info,
      progress_range: progress_range.map((i, idx) => rangeFormatter(i,
        [time[formTimeTypes[idx][0]], time[formTimeTypes[idx][1]]])),
      questions: compact(questions.map(q => (has(q, 'question') && !!q.question) && q.question)),
      receipt_range: receipt_range.map((i, idx) => rangeFormatter(i,
        [[today.getHours(), today.getMinutes()], ['23', '59']][idx])),
      tag_ids: tags.map(({id}) => id),
      user_expose_type: 'real',
      is_online_meetup: is_online_meetup,
      ...(is_online_meetup ? {
        online_note: online_note
      } : {
        address: address,
        coordinates: coordinates,
        detail_address: detail_address,
        region: region,
      })
    };
    const formData = new FormData();

    if (!isEmpty(avatar)) {
      formData.append('image', avatar.file);
    }

    // Story 업데이트 API
    const meetupCreate = has(avatar, 'file')
      ? storyApi.upload('image', formData)
        .then(({data: {results}}) => {
          return meetupApi.create({...form, avatar_uid: results[0].uid})
        })
      : meetupApi.create(form);

    meetupCreate
      .then(({status}) => {
        if (Math.floor(status / 100) === 2) {
          next()
        } else {
          throw '서버에서 오류가 발생했습니다. 관리자에게 문의해주세요.';
        }
      })
      .catch(e => console.error(e));
  };

  // Life Cycle
  // Form 필드 등록 (register())
  React.useEffect(() => {
    localFormStructure.map(i => register({name: i}));
  }, []);

  return (
    <Section>
      <FormContext {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs currentTab={currentTab}>
            {convertTabContent(MeetupBasicInfoTabPC)}
            {convertTabContent(MeetupBodyTabPC)}
            {convertTabContent(MeetupOptionTabPC, {optionState, options: getValues().options})}
            {convertTabContent(MeetupCommissionTabPC, {optionState})}
            {convertTabContent(MeetupCompleteTabPC)}
          </Tabs>
        </form>
      </FormContext>
    </Section>
  );
};

export default loginRequired(
  userTypeRequired(
    React.memo(MeetupNewPC),
    MAIN_USER_TYPES
  )  
);
