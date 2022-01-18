import React from 'react';
import Title from 'components/Title';
import useAuth from 'hooks/useAuth';
import { Typography } from 'antd';
import { Content } from 'antd/lib/layout/layout';

const Home: React.ViewComponent = ({ verboseName }) => {
  const { user } = useAuth();
  const welcomeMessage = () : string => {
    if (user) {
      if (user.first_name && user.last_name) {
        return `Bienvenido, ${user.first_name} ${user.last_name}`;
      }
      if (user.first_name) {
        return `Bienvenido, ${user.first_name}`;
      }
    }
    return 'Bienvenido';
  };

  return (
    <Content>
      <Title viewName={verboseName} />
      <Typography.Title level={3} style={{ marginLeft: '1em' }}>
        { welcomeMessage() }
      </Typography.Title>
    </Content>
  );
};
export default Home;
