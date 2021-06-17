import { isFunction, isObject } from 'lodash';
import React, { useState, useEffect } from 'react';
import { oneOfType, object, func } from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './styles.scss';

const menu = (
  <Menu>
    <Menu.Item>
      <Link to="/logout">退出登录</Link>
    </Menu.Item>
  </Menu>
);

const ProfileOps = props => {
  const { user } = props;
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    if(isFunction(user)){
      user().then(data => setUserInfo(data));
    }else{
      setUserInfo(user);
    }
  }, []);

  return (
    <Dropdown overlay={menu} placement="bottomRight">
      <a className={classNames(styles['user-outlined'])}>
        <Space>
          <UserOutlined />
          {isObject(userInfo) && <span>{userInfo.userName}</span>}
        </Space>
      </a>
    </Dropdown>
  );
};

ProfileOps.propTypes = {
  user: oneOfType([object, func]),
};

export default ProfileOps;
