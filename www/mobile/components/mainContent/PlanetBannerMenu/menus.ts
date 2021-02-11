import {staticUrl} from '../../../src/constants/env';

const menus = [
  {
    img: staticUrl('/static/images/icon/main-menu-community.png'),
    name: '커뮤니티',
    url: '/community'
  },
  {
    img: staticUrl('/static/images/icon/main-menu-onclass.png'),
    name: '온라인강의',
    url: '/onclass'
  },
  {
    img: staticUrl('/static/images/icon/main-menu-meetup.png'),
    name: '세미나/모임',
    url: '/meetup'
  },
  {
    img: staticUrl('/static/images/icon/main-menu-moa.png'),
    name: 'MOA',
    url: '/band'
  },
  {
    img: staticUrl('/static/images/icon/main-menu-dict.png'),
    name: '처방사전',
    url: '/wiki'
  },
  // {
  //   img: staticUrl('/static/images/icon/main-menu-professor.png'),
  //   name: '김원장넷',
  //   url: '/professor'
  // },
  {
    img: staticUrl('/static/images/icon/main-menu-modunawa.png'),
    name: '모두나와',
    url: '/modunawa'
  },
  {
    img: staticUrl('/static/images/icon/main-menu-hospital.png'),
    name: '한의원',
    url: '/hospital'
  }
];

export default menus;
