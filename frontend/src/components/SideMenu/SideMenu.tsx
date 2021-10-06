import { FileDoneOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import useAuth from 'hooks/useAuth';
import React from 'react';
import { Link } from 'react-router-dom';
import { RegisteredGroup, RoutesType } from 'Routes';
import { Sider } from './SideMenu.styled';

const { SubMenu } = Menu;

const SideMenu: React.FC<{groups: RegisteredGroup}> = ({ groups }) => {
  const auth = useAuth();

  const { user } = auth;
  if (!user) {
    return null;
  }

  return (
    <Sider width={200}>
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        style={{ height: '100%', borderRight: 0 }}
      >
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
                    if (!route.showInMenu || (
                      route.hasAccess && !route.hasAccess(auth))) {
                      return null;
                    }

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
      </Menu>
    </Sider>
  );
};

export default SideMenu;
