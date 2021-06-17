import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'antd';


const createRoute = route => {
  if(route.children && route.children.some(({hideInMenu}) => !hideInMenu)){
    return route.hideInMenu || (
      <Menu.SubMenu key={route.path} icon={<MailOutlined />} title={route.name}>
        {route.children.map(_route => createRoute(_route))}
      </Menu.SubMenu>
    );
  }else{
    return route.hideInMenu || (
      <Menu.Item key={route.path} icon={<MailOutlined />}>
        <Link to={route.path}>{route.name}</Link>
      </Menu.Item>
    );
  }
};

const Menus = props => {
  const { menus } = props;
  const location = useLocation();


  return (
    <Menu>
      {location.pathname.split('/').map((item, idx) => (
        <Breadcrumb.Item key={idx}>{item}</Breadcrumb.Item>
      ))}
    </Menu>
  )
};


export default Menus;
