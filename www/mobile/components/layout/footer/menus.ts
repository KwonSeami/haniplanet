interface ITimeline {
  name: string;
  href?: string;
}

const menus: ITimeline[] = [
  {
    name: '개인정보 처리방침',
    href: '/terms?tab=privacy'
  },
  {
    name: '이용약관',
    href: '/terms?tab=terms'
  },
  {
    name: '세미나/모임 이용규정',
    href: '/terms?tab=payment'
  },
  {
    name: '온라인 강의 이용규정',
    href: '/terms?tab=onclass'
  },
  {
    name: '유료 서비스 이용약관',
    href: '/terms?tab=paidPayment'
  },
  {
    name: '제휴카드 안내/신청',
    href: '/terms?tab=associatedCard'
  },
];

export default menus;
