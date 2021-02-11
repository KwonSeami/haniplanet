import {staticUrl} from '../../../src/constants/env';

interface ILink {
  src: string;
  href: string;
  alt: string;
}

const links: ILink[] = [
  {
    src: staticUrl('/static/images/icon/icon-kakao.png'),
    href: 'https://pf.kakao.com/_WDxnvxl',
    alt: '한의플래닛 카카오톡'
  },
  {
    src: staticUrl('/static/images/icon/icon-facebook.png'),
    href: 'https://facebook.com/haniplanet/',
    alt: '한의플래닛 페이스북'
  },
  {
    src: staticUrl('/static/images/icon/icon-instagram.png'),
    href: 'https://instagram.com/balky.haniplanet/',
    alt: '한의플래닛 인스타그램'
  }
];

export default links;
