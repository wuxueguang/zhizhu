import 'antd/dist/antd.less';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Button } from 'antd';

import MenusWithBox from './MenusWithBox';

const App = () => {

  return (
    <Router>
      <MenusWithBox />
    </Router>
  );
};


render(<App/>, document.getElementById('root'));
