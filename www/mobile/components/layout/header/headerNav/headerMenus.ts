import {staticUrl} from "../../../../src/constants/env";

const TAG_MENUS = [
  // {
  //   name: '구인/구직',
  //   href: '/tag/[id]',
  //   as: (navMap) => `/tag/${navMap['구인/구직']}`,
  //   key: null,
  //   icon: staticUrl('/static/images/icon/icon-menu-job.png'),
  // },
  {
    name: '제휴서비스',
    href: () => '/tag/[id]',
    as: () => '/tag/제휴서비스',
    key: null,
    icon: staticUrl('/static/images/icon/icon-menu-affiliated.png'),
  },
];

const HEADER_MENUS = [
  {
    name: 'Home',
    href: () => '/',
    as: () => '/',
    key: null,
    icon: staticUrl('/static/images/icon/icon-menu-home.png'),
  },
  {
    name: '커뮤니티',
    href: () => '/community',
    as: () => '/community',
    key: null,
    icon: staticUrl('/static/images/icon/icon-menu-community.png'),
  },
  {
    name: '온라인강의',
    href: () => '/onclass',
    as: () => '/onclass',
    key: null,
    icon: staticUrl('/static/images/icon/menu-onclass.png'),
  },
  {
    name: '세미나/모임',
    href: () => '/meetup',
    as: () => '/meetup',
    key: '세미나/모임',
    icon: staticUrl('/static/images/icon/icon-menu-seminar.png'),
  },
  {
    name: 'MOA',
    href: () => '/band',
    as: () => '/band',
    key: null,
    icon: staticUrl('/static/images/icon/icon-menu-moa.png'),
  },
  {
    name: '처방사전',
    href: () => '/wiki',
    as: () => '/wiki',
    key: null,
    icon: staticUrl('/static/images/icon/icon-menu-dict.png'),
  },
  // {
  //   name: '김원장넷',
  //   href: () => '/professor',
  //   as: () => '/professor',
  //   key: null,
  //   icon: staticUrl('/static/images/icon/icon-menu-professor.png'),
  // },
  {
    name: '모두나와',
    href: () => '/modunawa',
    as: () => '/modunawa',
    key: null,
    icon: staticUrl('/static/images/icon/icon-menu-modunawa.png'),
  },
  {
    name: '한의원',
    href: () => '/hospital',
    as: () => '/hospital',
    key: null,
    icon: staticUrl('/static/images/icon/icon-menu-hospital.png'),
  },
  {
    name: '공지사항',
    href: () => '/guide',
    as: () => '/guide',
    key: null,
    icon: staticUrl('/static/images/icon/icon-menu-help.png'),
  },
  ...TAG_MENUS,
];

export default HEADER_MENUS;