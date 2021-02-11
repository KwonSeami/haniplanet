import Link from "next/link";

export const TAG_MENUS = [
  // {
  //   name: '함께 만드는 한의플래닛',
  //   href: '/tag/[id]',
  //   as: () => `/tag/함께 만드는 한의플래닛`,
  // },
  // {
  //   name: '구인/구직',
  //   href: '/tag/[id]',
  //   as: (navMap) => `/tag/${navMap['구인/구직']}`,
  // },
  {
    name: '제휴서비스',
    href: () => '/tag/[id]',
    as: () => '/tag/제휴서비스',
  },
];

const HEADER_MENUS = [
  {
    name: '커뮤니티',
    key: null,
    href: () => '/community',
    as: () => '/community',
  },
  {
    name: '온라인강의',
    key: null,
    href: () => '/onclass',
    as: () => '/onclass',
  },
  {
    name: '세미나/모임',
    key: '세미나/모임',
    href: () => '/meetup',
    as: () => '/meetup',
  },
  {
    name: 'MOA',
    href: () => '/band',
    as: () => '/band',
  },
  {
    name: '플래닛마켓',
    href: () => '/shopping',
    as: () => '/shopping',
    children: (
      <ul>
        <li>
          <Link
            href="/shopping"
            as="/shopping"
          >
            <a>상품목록</a>
          </Link>
        </li>
        <li>
          <Link
            href="/shopping/cart"
            as="/shopping/cart"
          >
            <a>장바구니</a>
          </Link>
        </li>
        <li>
          <Link
            href="/payment"
            as="/payment"
          >
            <a>결제내역</a>
          </Link>
        </li>
      </ul>
    )
  },
  {
    name: '처방사전',
    href: () => '/wiki',
    as: () => '/wiki',
  },
  // {
  //   name: '김원장넷',
  //   href: () => '/professor',
  //   as: () => '/professor',
  // },
  {
    name: '모두나와',
    href: () => '/modunawa',
    as: () => '/modunawa',
  },
  {
    name: '한의원',
    href: () => '/hospital',
    as: () => '/hospital',
  },
  ...TAG_MENUS
];

export default HEADER_MENUS;
  