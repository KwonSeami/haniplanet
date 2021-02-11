import dynamic from 'next/dynamic';

const PaginationDynamic = dynamic({
  ssr: false,
  loader: () => import('./Pagination'),
});

export default PaginationDynamic;
