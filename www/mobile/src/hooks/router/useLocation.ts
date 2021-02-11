import {useRouter} from 'next/router';

const useLocation = () => {
  const router = useRouter();
  const navigate = (to, {replace = false} = {}) => {
    if (replace) {
      return router.replace(to);
    } else {
      return router.push(to);
    }
  };

  const {asPath, back, push, replace} = router;
  const [pathname = '', search = ''] = asPath.split('?');

  return {
    location: {pathname, search},
    history: {push, replace, goBack: back},
    navigate,
  };
};

export default useLocation;
