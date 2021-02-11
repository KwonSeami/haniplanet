/**
 * 작업: 정윤재
 * 1. Weekly Topic - 토픽에 참여해보세요!
 * 2. 한의학NEWS - 최신 한의학 소식
 * 3. Weekly Card - 최신 한의학 소식
 * 과 같이 항상 쌍을 이루게 됩니다. (고정)
 * 이를 객체 상수로 분리하여, WeeklyWrapper 컴포넌트에서 text과 to 값을 쉽게 사용하도록 하였습니다.
 */

interface IAnnouncement {
  text: string;
  to: string;
}

export interface IAnnouncementCardData {
  weeklyTopic: IAnnouncement;
  weeklyCard: IAnnouncement;
  haniNews: IAnnouncement;
}

export const WEEKLY_TOPIC = 'Weekly Topic';
export const WEEKLY_CARD = 'Weekly Card';
export const HANI_NEWS = 'haniNews';

const ANNOUNCEMENT_CARD_DATA: IAnnouncementCardData = {
  [WEEKLY_TOPIC]: {
    text: '토픽에 참여해보세요!',
    to: '/'
  },
  [WEEKLY_CARD]: {
    text: '최신 한의학 소식',
    to: '/'
  },
  [HANI_NEWS]: {
    text: '최신 한의학 소식',
    to: '/'
  }
};
export default ANNOUNCEMENT_CARD_DATA;