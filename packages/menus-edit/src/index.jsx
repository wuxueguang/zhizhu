
import { isObject, isArray } from 'lodash';
import React, { useState, useEffect } from 'react';
import { Table, Space, Modal, Form, Input, Button, message } from 'antd';
import { func } from 'prop-types';
import partialColumns from './columns';

const ADD = 'add menu';
const UPDATE = 'update menu';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const MenusEdit = props => {
  const { fetchMenus, addMenu, updateMenu, deleteMenu } = props;
  const [form] = Form.useForm();

  const [columns, setColumns] = useState();
  const [menus, setMenus] = useState();
  const [fetchingMenus, setFetchingMenus] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [oprationType, setOperationType] = useState();
  const [activeParentMenu, setActiveParentMenu] = useState();
  const [activeMenu, setActiveMenu] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [prefix, setPrefix] = useState('/');

  const doFetchMenus = () => {
    setFetchingMenus(true);
    return fetchMenus().then(menus => {

      const inner = (menus, idMap) => {
        idMap = idMap || {};
        menus.forEach(menu => {
          idMap[menu.id] = menu;
          if(isArray(menu.children)){
            inner(menu.children, idMap);
          }
        });
        return idMap;
      };

      setMenus(menus);

      return inner(menus);
    }).then(menusIdMap => {
      setColumns([...partialColumns, {
        title: '操作',
        dataIndex: 'id',
        key: 'operators',
        fixed: 'right',
        render(id){
          const menu = menusIdMap[id];
          const parentMenu = menu.parentId ? menusIdMap[menu.parentId] : null;

          const pathHasError = menu => {
            const parentMenu = menu.parentId ? menusIdMap[menu.parentId] : null;
            return isObject(parentMenu) ? !(new RegExp(`^${parentMenu.path || ''}`)).test(menu.path) : false;
          };

          return (
            <Space>
              <a
                onClick={() => {
                  setActiveParentMenu(parentMenu);
                  setActiveMenu(menu);
                  setOperationType(UPDATE);
                  setModalVisible(true);
                }}
              >修改</a>
              <a
                onClick={() => {
                  Modal.confirm({
                    title: '删除菜单',
                    content: `确认删除菜单 ${menu.name}?`,
                    onOk: async () => {
                      await deleteMenu(menu);
                      message.success('操作成功');
                      doFetchMenus();
                    },
                  });
                }}
              >删除</a>
              <a
                onClick={() => {
                  setActiveParentMenu(menusIdMap[id]);
                  setActiveMenu(null);
                  setOperationType(ADD);
                  setModalVisible(true);
                }}
              >添加子菜单</a>
              {pathHasError(menu) && !pathHasError(parentMenu) && (
                <a
                  onClick={() => {
                    Modal.confirm({
                      title: '路径修复',
                      content: `菜单 ${menu.name} 的路径由 ${menu.path} 修改为 ${parentMenu.path || ''}${menu.path}`,
                      onOk: () => new Promise(resolve => {
                        const newMenu = {
                          ...menu,
                          path: `${parentMenu.path}${menu.path}`,
                        };
                        updateMenu(newMenu, parentMenu).then(() => {
                          resolve();
                          doFetchMenus();
                          message.success('操作成功');
                        });
                      }),
                    });
                  }}
                >修复路径</a>
              )}
            </Space>
          );
        },
      }]);
    }).finally(() => {
      setFetchingMenus(false);
    });
  };

  useEffect(doFetchMenus, []);

  // before show Modal
  useEffect(() => {
    if(modalVisible){
      const prefix = activeParentMenu ? `${activeParentMenu.path || ''}/` : '/';
      const values = {
        id: oprationType === UPDATE ? activeMenu.id : null,
        name: oprationType === UPDATE ? activeMenu.name : null,
        path: oprationType === UPDATE ? (activeMenu.path || '').replace(new RegExp(`^${prefix}`), '') : null,
        icon: oprationType === UPDATE ? activeMenu.icon : null,
      };
      if(oprationType === UPDATE && isObject(activeParentMenu)){
        values.path = values.path.replace(new RegExp(`^${activeParentMenu.path}`), '');
      }
      form.setFieldsValue(values);

      setPrefix(prefix);
    }
  }, [modalVisible]);

  const confirmHandler = () => {
    form.validateFields().then(async values => {
      setConfirmLoading(true);
      try{
        let newMenu;
        if(oprationType === ADD){
          newMenu = {
            ...activeMenu,
            ...values,
            parentId: activeParentMenu ? activeParentMenu.id : null,
            path: `${prefix}${values.path}`,
          };
          await addMenu(newMenu, activeParentMenu);   // menu, parentMenu
        }else{
          newMenu = {
            ...values,
            path: `${prefix}${values.path}`,
          };
          await updateMenu(newMenu);
        }
        message.success('操作成功');
        doFetchMenus();
      }catch(err){
        console.log(err);
      }finally{
        setConfirmLoading(false);
        setModalVisible(false);
      }
    });
  };

  const title = () => {
    switch(oprationType){
    case ADD:
      return activeMenu ? `为 ${activeMenu.name} 增加子菜单` : '增加一级菜单';
    case UPDATE:
      return `修改 ${activeMenu.name} 菜单`;
    }
  };

  return (
    <>
      <Button
        type="primary"
        style={{marginBottom: 10}}
        onClick={() => {
          setActiveMenu(null);
          setActiveParentMenu(null);
          setOperationType(ADD);
          setModalVisible(true);
        }}
      >增加一级菜单</Button>

      <Table
        rowKey="id"
        size="small"
        loading={fetchingMenus}
        columns={columns}
        dataSource={menus}
        pagination={false}
      />

      <Modal
        destroyOnClose
        title={title()}
        visible={modalVisible}
        confirmLoading={confirmLoading}
        onCancel={() => setModalVisible(false)}
        onOk={confirmHandler}
      >
        <Form
          form={form}
          {...formItemLayout}
        >
          <Form.Item
            name="id"
            style={{display: 'none'}}
          ><Input disabled/></Form.Item>

          <Form.Item
            required
            name="name"
            label="名称"
            rules={[{required: true, message: '名称不能为空'}]}
          ><Input /></Form.Item>

          <Form.Item
            required
            name="path"
            label="路径"
            rules={[{required: true, message: isObject(activeParentMenu) ? '子路径不能为空' : '路径不能为空'}]}
          ><Input prefix={prefix} /></Form.Item>

          <Form.Item
            name="icon"
            label="图标"
          ><Input /></Form.Item>
        </Form>
      </Modal>
    </>
  );
};

MenusEdit.propTypes = {
  fetchMenus: func,
  addMenu: func,
  updateMenu: func,
  deleteMenu: func,
};

export default MenusEdit;
