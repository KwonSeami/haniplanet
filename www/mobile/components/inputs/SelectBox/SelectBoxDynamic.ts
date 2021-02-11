import dynamic from 'next/dynamic';

const SelectBoxDynamic = dynamic({
  ssr: false,
  loader: () => import('.'),
});

export default SelectBoxDynamic;