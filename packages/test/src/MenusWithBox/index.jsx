
import React, { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import Breadcrumb from './components/Breadcrumb';

import { GlobalStyle, Box } from './styled';

const Menus = props => {
  const { children } = props;

  return (
    <Box>
      <GlobalStyle />
      <div className="left-box expanded">
        <div className="logo-box">
          <div style={{lineHeight: '40px', backgroundColor: '#ccc'}}>logo</div>
        </div>
        <div className="menu-box">

        </div>
      </div>
      <div className="right-box">
        <div className="top-box">
          <Breadcrumb />
        </div>
        <div className="bottom-box">{children}</div>
      </div>
    </Box>
  )
};


export default Menus;
