/*------------------------------------*\
  Imports
\*------------------------------------*/
import React from 'react';

import '../style/_spinner.scss';



/*------------------------------------*\
  Functional
\*------------------------------------*/
const Spinner = () => (
  <div className="spinner">

    <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          <feBlend in2="goo" in="SourceGraphic" result="mix" />
        </filter>
      </defs>
    </svg>

    <div className="spinner-blobs">
      <div className="spinner-blob"></div>
      <div className="spinner-blob"></div>
    </div>

  </div>
);



/*------------------------------------*\
  Export
\*------------------------------------*/
export default Spinner;
