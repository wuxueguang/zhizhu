
import React from 'react';
import { func } from 'prop-types';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const Login = props => {
  const { doLogin } = props;
  const history = useHistory();
  const [form] = Form.useForm();

  const submitHandler = () => {
    form.validateFields().then(values => {
      doLogin(values).then(() => history.push('/'));
    });
  };

  return (
    <Form
      form={form}
      className="form-login"
    >
      <Form.Item
        name="name"
        className="input-name"
      >
        <Input placeholder="请输入用户名" prefix={<UserOutlined />} />
      </Form.Item>
      <Form.Item
        name="password"
        className="input-password"
      >
        <Input.Password
          placeholder="请输入用户密码"
          prefix={<LockOutlined />}
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>
      <Form.Item className="btn-submit">
        <Button
          type="primary"
          style={{width: '100%'}}
          onClick={submitHandler}
        >登录</Button>
      </Form.Item>
    </Form>
  );
};

Login.propTypes = {
  doLogin: func,
};

export default Login;
