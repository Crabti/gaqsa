import { message, Tooltip } from 'antd';
import useAuth from 'hooks/useAuth';
import { useBackend } from 'integrations';
import React, { useEffect, useState } from 'react';
import {
  HeaderCont,
  Logo,
  RightContainer,
  LoginIcon,
} from './Header.styled';

const LoginBtn: React.FC = () => {
  const backend = useBackend();
  const { setTokens, user } = useAuth();
  const [canLogin, setCanLogin] = useState(true);

  useEffect(() => {
    setCanLogin(!user);
  }, [user]);

  const login = async (): Promise<void> => {
    if (!canLogin) {
      return;
    }

    const [result, error] = await backend.users.post<
      {access: string; refresh: string;}, {username: string; password: string;}
    >(
      `${backend.users.baseURL}/login/`, {
        username: 'root',
        password: 'Metallica#1',
      },
    );

    if (error || !result || !result.data) {
      message.error('¡Error al iniciar sesión!');
      return;
    }

    setTokens(result.data.access, result.data.refresh);
    message.success('Sesión inciada');
  };

  if (!canLogin) return <></>;

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
