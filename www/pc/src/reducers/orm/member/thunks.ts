import BandApi from '../../../apis/BandApi';
import {axiosInstance} from '@hanii/planet-apis';
import {bulkSaveMember, delMember, updateMember} from './memberReducer';
import {memberListSelector} from './selector';
import isEmpty from 'lodash/isEmpty';
import {updateMemberList} from './memberListReducer';
import {BASE_URL} from '../../../constants/env';

// 각각 가입 신청한, 가입된 회원
type TMemberSort = 'applied' | 'joined';
// 가입 거절 혹은 탈퇴 - 'remove', 가입 승인 - 'append'
type TMemberListType = 'append' | 'remove';

export const fetchMemberThunk = ({
  slug,
  sort,
  status,
  option,
  next
}: {
  slug: string,
  sort: TMemberSort,
  status: 'active' | 'ongoing',
  option?: Indexable,
  next?: string
}) =>
  (dispatch, getState) => {
    const key = `${slug}_${sort}`;
    const {system: {session: {access}}, orm} = getState();
    const [ids, rest] = memberListSelector(key)(orm);
    const api = new BandApi(access);

    if ((isEmpty(ids) && isEmpty(rest))
      || next
      || option.order_by && (rest.orderBy !== option.order_by)
    ) {
      (next
        ? axiosInstance({token: access, baseURL: BASE_URL}).get(next)
        : api.getBandMemberList({
          slug,
          status,
          option
        })
      ).then(({data: {results, ...kwargs}}) => {
        !!results && dispatch(bulkSaveMember(results, {
          ...kwargs,
          orderBy: option.order_by || '',
          writeType: (isEmpty(rest) || (option.order_by && (rest.orderBy === option.order_by)))
            ? 'append'
            : 'overwrite',
          listKey: key
        }));
      });
    }
  };

export const appendOrRemoveMemberList = ({
  slug,
  listKey,
  anotherListKey,
  memberPk,
  type,
}: {
  slug: string;
  listKey: string;
  anotherListKey?: string;
  memberPk: HashId;
  type: TMemberListType;
}) =>
  (dispatch, getState) => {
    const {system: {session: {access}}} = getState();
    const api = new BandApi(access);

    (type === 'remove'
      ? api.denyAppliedMember(slug, memberPk)
      : api.approveAppliedMember(slug, memberPk)
    ).then(({status}) => {
      if (Math.floor(status / 100) !== 4) {
        alert('처리가 완료되었습니다.');
  
        dispatch(updateMemberList(listKey, (curr) => ({
          ...curr,
          ids: curr.ids.filter(id => id !== memberPk),
          rest: {
            ...curr.rest,
            count: curr.rest.count - 1
          }
        })));
  
        if (type === 'remove') {
          dispatch(delMember(memberPk));
        } else {
          dispatch(updateMemberList(anotherListKey, (curr) => ({
            ids: [...curr.ids, memberPk],
            rest: {
              ...curr.rest,
              count: curr.rest.count + 1
            }
          })));
        }
      }
    });
  };

export const readMemberThunk = ({
  slug,
  readAt,
  memberPk
}: {
  slug: string;
  readAt: string;
  memberPk: HashId;
}) =>
  (dispatch, getState) => {
    const {system: {session: {access}}} = getState();
    const api: BandApi = new BandApi(access);

    const LIST_KEY = `${slug}_applied`;

    if (readAt === null) {
      api.getAppliedMember(slug, memberPk)
        .then(({data: {result}}) => {
          dispatch(updateMember(memberPk, result));
          dispatch(updateMemberList(LIST_KEY, curr => ({
            ...curr,
            rest: {
              ...curr.rest,
              unread_count: curr.rest.unread_count - 1
            }
          })));
        });
    }
  };
