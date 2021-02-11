import * as React from 'react';
import {FaqWrapperDiv, FaqListUl} from './style/HospitalFaq';
import {HashId} from '@hanii/planet-types';
import Avatar from '../AvatarDynamic';
import Link from 'next/link';
import { toDateFormat } from '../../src/lib/date';
import isEmpty from 'lodash/isEmpty';
import NoContent from '../NoContent/NoContent';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { RootState } from '../../src/reducers';
import { setLayout } from '../../src/reducers/system/style/styleReducer';
import moment from 'moment';

interface FaqItemProps extends IDocTalkFaq {
  user: {
    id: HashId;
    name: string;
    avatar: string;
  }
}

const _HospitalFaqItem: React.FC<FaqItemProps> = ({
  id,
  question_title,
  answer,
  answered_at,
  region,
  age_and_gender,
  disease,
  user: {id: userId, name, avatar}
}) => {
  const userLength = [region, age_and_gender, disease].reduce((prevValue: number, currentValue: string) => {
    return prevValue + currentValue.length;
  }, 0);
  
  return (
    <li>
      <div className="profile">
        <div>
          <Avatar
            id={userId}
            src={avatar}
            size={45}
          />
          <p>
            <em>{name}</em> 한의사 답변
            <Link
              href="/faq/[id]"
              as={`/faq/${id}`}
            >
              <a>
                자세히보기
              </a>
            </Link>
          </p>
          <small>
            {toDateFormat(answered_at, 'YYYY.MM.DD')}
          </small>
        </div>
      </div>
      <div className="content">
        <dl>
          <dt>
            <em>{region} {age_and_gender} {disease}</em> -
            {question_title.substring(0, (28-userLength))}
          </dt>
          <dd>{answer}</dd>
        </dl>
      </div>
    </li>
  )
};

const HospitalFaqItem = React.memo(_HospitalFaqItem);

const HospitalFaq: React.FC = ({members}) => {
  const dispatch = useDispatch();
  let faqList = [];
  let count = 0;
  members.forEach(({user: {id, name, avatar, doctalk_faqs, doctalk_faqs_count}}) => {
    count += doctalk_faqs_count;
    doctalk_faqs.forEach((faq) => {
      faqList = [
        ...faqList,
        {
          ...faq,
          user: {id, name, avatar}
        }
      ]
    })
  });

  faqList.sort(({created_at: beforeCreatedAt}, {created_at: afterCreatedAt}) => {
    const diff = moment(beforeCreatedAt).diff(afterCreatedAt, 'second') > 0;
    return diff ? -1 : 1;
  });


  const {headerDetail} = useSelector(
    ({system: {style: {header: {layout}}}}: RootState) => layout,
    shallowEqual,
  );

  React.useEffect(() => {
    if(headerDetail !== '') {
      dispatch(setLayout({
        headerDetail: ''
      }))
    }
  }, [headerDetail]);
  
  return (
    <FaqWrapperDiv>
      <header>
        <h3>FAQ</h3>
        <span>
          총 <em>{count}</em>건
        </span>
        <p>*나의 FAQ관리는 PC에서만 가능합니다.</p>
      </header>
      <div>
        {isEmpty(faqList) ? (
          <NoContent>작성 된 FAQ가 없습니다.</NoContent>
        ) : (
          <FaqListUl>
            {faqList.map(({id, ...props}) => (
              <HospitalFaqItem
                key={id}
                id={id}
                {...props}
              />
            ))}
          </FaqListUl>
        )}
      </div>
    </FaqWrapperDiv>
  );
};

HospitalFaq.displayName = 'HospitalFaq';
export default React.memo(HospitalFaq);