
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';

const Menus = props => {
  const { menus } = props;
  const location = useLocation();


  return (
    <Breadcrumb>
      {location.pathname.split('/').map((item, idx) => (
        <Breadcrumb.Item key={idx}>{item}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  )
};


export default Menus;
