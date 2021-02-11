import * as React from 'react';

const EditorDictSVG = React.memo(() => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <defs>
      <path id="a" d="M0 .2h20.8V16H0z"/>
    </defs>
    <g fill="none" fillRule="evenodd">
      <g transform="translate(3 5.6)">
        <path
          fill="#506079"
          d="M19.3 12.905s-.838-.5-3.6-.5c-2.761 0-5.2 1.4-5.2 1.4V3.6s1.823-1.446 4.647-1.446c2.822 0 4.153.941 4.153.941v9.81zM18.9.6C18 .3 16.8.2 15.7.2c-1.9 0-3.9.4-5.2 1.4-.5-.4-1.3-.8-1.9-1v1.778H6.094v2.734H1.6V5.4 2.5H0v12.6c0 .2.2.5.5.5h.2c1.3-.6 3.1-1 4.5-1 1.9 0 3.9.4 5.2 1.4 1.3-.8 3.6-1.4 5.2-1.4s3.2.3 4.5 1h.2c.2 0 .5-.2.5-.5V1.6c-.6-.4-1.2-.7-1.9-1z"
          mask="url(#b)"
        />
      </g>
      <path
        fill="#506079"
        d="M5.8 3v2.524H3v1.653h2.8V9.7h1.9V7.177h2.9V5.524H7.7V3z"
      />
    </g>
  </svg>
));

export default EditorDictSVG;
