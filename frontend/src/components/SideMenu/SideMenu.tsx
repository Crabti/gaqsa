import { FileDoneOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { RegisteredGroup, RoutesType } from 'Routes';

const { Sider } = Layout;
const { SubMenu } = Menu;

const SideMenu: React.FC<{groups: RegisteredGroup}> = ({ groups }) => (
  <Sider width={200}>
    <Menu
      mode="inline"
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      style={{ height: '100%', borderRight: 0 }}
    >
      <>
        {Object.values(groups).map(
          (group) => {
            if (!group.showInMenu) return null;

            const Icon = group.icon || FileDoneOutlined;

            return (
              <SubMenu
                key={`${group.verboseName}-subMenu`}
                icon={<Icon />}
                title={group.verboseName}
              >
                {Object.values(group.routes).map(
                  (route) => {
                    if (!route.showInMenu) return null;

                    const { path, verboseName }: RoutesType = route;

                    return (
                      <Menu.Item key={`${verboseName}-menu-item`}>
                        <Link to={path}>
                          {verboseName}
                        </Link>
                      </Menu.Item>
                    );
                  },
                )}
              </SubMenu>
            );
          },
        )}
      </>
    </Menu>
  </Sider>
);

export default SideMenu;
