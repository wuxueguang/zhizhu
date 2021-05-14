import 'antd/dist/antd.less';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Button } from 'antd';

import FullViewSpin from '@/components/FullViewSpin';
import Layout from './BoxWithMenus/components/BasicLayout'

const App = () => {

  return (
    <Router><Layout /></Router>
  );
};



const root = document.createElement('div');
document.body.appendChild(root);
render(<App/>, root);
