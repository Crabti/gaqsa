import { message, Tooltip } from 'antd';
import { useBackend } from 'integrations';
import React from 'react';
import {
  HeaderCont,
  Logo,
  RightContainer,
  LoginIcon,
} from './Header.styled';

const LoginBtn: React.FC = () => {
  const backend = useBackend();

  const login = async (): Promise<void> => {
    const [result, error] = await backend.users.post(
      `${backend.users.baseURL}/login/`, {
        username: 'root',
        password: 'Metallica#1',
      },
    );

    if (error || !result || !result.data) {
      message.error('¡Error al iniciar sesión!');
      return;
    }

    message.success('Sesión inciada');
    console.log(result);
  };

  return (
    <Tooltip title="Iniciar sesión">
      <LoginIcon onClick={login} />
    </Tooltip>
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
