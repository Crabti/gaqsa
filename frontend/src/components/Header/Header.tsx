import { Popconfirm, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import routes from 'Routes';
import {
  HeaderCont,
  Logo,
  RightContainer,
} from './Header.styled';

const LoginBtn: React.FC = () => {
  const { user, logout } = useAuth();
  const [canLogin, setCanLogin] = useState(true);

  useEffect(() => {
    setCanLogin(!user);
  }, [user]);

  if (!canLogin) {
    return (
      <Popconfirm
        title="¿Deseas cerrar sesión?"
        onConfirm={logout}
        okText="Sí"
        cancelText="No"
        placement="bottomRight"
      >
        <Typography.Link>
          Cerrar Sesión
        </Typography.Link>
      </Popconfirm>
    );
  }

  return (
    <Link to={routes.otherRoutes.routes.login.path} component={Typography.Link}>
      Iniciar Sesión
    </Link>
  );
};

const Header: React.FC = () => (
  <HeaderCont>
    <Logo />
    <RightContainer>
      <LoginBtn />
    </RightContainer>
  </HeaderCont>
);

export default Header;
