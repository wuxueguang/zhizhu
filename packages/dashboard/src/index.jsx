
import { isFunction, isArray, isObject } from 'lodash';
import React, { useEffect, useState } from 'react';
import { string, object, func, arrayOf, element, oneOfType } from 'prop-types';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Switch, Route, useHistory, useLocation, Redirect } from 'react-router-dom';
import PathCrumb from '@zhizhu/path-crumb';
import Menus from '@zhizhu/menus';
import { Spin, Card } from 'antd';

import ProfileOps from './components/TopBarRightContent';
import Logo from './components/Logo';
import Login from './components/Login';
import Logout from './components/Logout';

import { GlobalStyle, Box } from './styled';

const loginSs = {
  NOT_CHECKED: 'not checked',
  LOGINED: 'logined',
  LOGOUTED: 'logouted',
};

const LayoutWithNavsider = props => {
  const history = useHistory();
  const location = useLocation();

  const { pathDefault, logo, checkLogin, fetchMenus, children } = props;

  const [menus, setMenus] = useState();
  const [inlineCollapsed, setInlineCollapsed] = useState(false);
  const [loginStatus, setLoginStatus] = useState(loginSs.NOT_CHECKED);

  useEffect(() => {
    if (isFunction(checkLogin)) {
      checkLogin().then(() => {
        setLoginStatus(loginSs.LOGINED);
      }).catch(() => {
        setLoginStatus(loginSs.LOGOUTED);
      });
    } else {
      // 无效checkLogin 用fetchMenus是否获取到有效数据来判断是否已登录
      fetchMenus().then(menus => {
        setMenus(menus);
        setLoginStatus(loginSs.LOGINED);
      }).catch(() => {
        setLoginStatus(loginSs.LOGOUTED);
      });
    }
  }, []);

  useEffect(() => {
    if(location.pathname === '/' && pathDefault){
      history.push(pathDefault);
    }
  }, [location.pathname, pathDefault]);

  useEffect(() => {
    if (loginStatus === loginSs.LOGINED && !isArray(menus)) {
      fetchMenus().then(menus => setMenus(menus));
    }
  }, [loginStatus, menus]);

  let logoEle = <Logo/>;
  if(React.isValidElement(logo)){
    logoEle = logo;
  }else if(isFunction(logo)){
    logoEle = logo(inlineCollapsed);
  }else if(isObject(logo) && isFunction(logo.render)){
    logoEle = logo.render(inlineCollapsed);
  }

  switch(loginStatus){
  case loginSs.NOT_CHECKED:
    return <Spin />;
  case loginSs.LOGOUTED:
    return <Redirect to="/login"/>;
  default:
    return isArray(menus) && menus.length && (
      <>
        <GlobalStyle />
        <Box>
          <div className="left-box expanded">
            <div className="logo-box">{logoEle}</div>
            <div className="menus-box">
              <Menus menus={ menus } path={location.pathname} history={history} splitTopMenu={ true } inlineCollapsed={ inlineCollapsed } />
            </div>
          </div>
          <div className="right-box">
            <div className="top-box">
              <div className="crumb-box">
                <a
                  className="collapsed-icon"
                  onClick={ () => setInlineCollapsed(!inlineCollapsed) }
                >{ inlineCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined /> }</a>
                <PathCrumb menus={ menus } path={location.pathname} />
              </div>
              <div className="profile-box"><ProfileOps user={{userName: '龙傲天'}}/></div>
            </div>
            <div className="bottom-box">
              { children }
            </div>
          </div>
        </Box>
      </>
    );
  }
};

const Layout = props => {
  const { login, logout, children, ...others } = props;

  const [loginEle, setLoginEle] = useState(null);
  const [logoutEle, setLogoutEle] = useState(null);

  useEffect(() => {
    if(React.isValidElement(login)){
      setLoginEle(login);
    }else if(isFunction(login)){
      setLoginEle(login());
    }else if(isObject(login) && isFunction(login.render)){
      setLoginEle(login.render());
    }else if(isObject(login)){
      setLoginEle(<Login doLogin={login.doLogin}/>);
    }
  }, [login]);

  useEffect(() => {
    if(React.isValidElement(logout)){
      setLogoutEle(logout);
    }else if(isFunction(logout)){
      setLogoutEle(logout());
    }else if(isObject(logout) && isFunction(logout.render)){
      setLogoutEle(logout.render());
    }else if(isObject(logout)){
      setLogoutEle(<Logout doLogout={logout.doLogout}/>);
    }
  }, [logout]);

  return (
    <Router>
      <Switch>
        <Route path="/login">{loginEle}</Route>
        <Route path="/logout">{logoutEle}</Route>
        <Route path="/">
          <LayoutWithNavsider {...others}>
            <Card bordered={false}>
              <Route path="/404">
                <span>页面不存在或者没有权限访问此页面</span>
              </Route>
              {children}
            </Card>
          </LayoutWithNavsider>
        </Route>
      </Switch>
    </Router>
  );
};

Layout.propTypes = LayoutWithNavsider.propTypes = {
  checkLogin: func,
  fetchMenus: func,
  pathDefault: string,

  children: oneOfType([string, element, arrayOf(element)]),

  logo: oneOfType([element, func, object]),
  login: oneOfType([element, func, object]),
  logout: oneOfType([element, func, object]),
};

export default Layout;
