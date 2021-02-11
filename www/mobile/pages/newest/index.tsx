import Router from 'next/router';

const Newest = () => null;

Newest.getInitialProps = async (ctx) => {
  if (ctx.res) {
    ctx.res.writeHead(302, {
      Location: '/community'
    });
    ctx.res.end();
  } else {
    Router.replace('/community');
  }

  return {};
};

export default Newest;
