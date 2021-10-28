import React from 'react';
import Title from 'components/Title';
import { Row, Typography } from 'antd';
import useAuth from 'hooks/useAuth';

const Home: React.ViewComponent = ({ verboseName }) => {
  const { user } = useAuth();
  return (
    <>
      <Title viewName={verboseName} parentName="Gaqsa" />
      <Row justify="center">
        <Typography.Title level={4}>
          Bienvenido
          {
        (user && user?.first_name && user.last_name)
          ? ` ${user.first_name} ${user.last_name}` : null
        }
        </Typography.Title>
      </Row>

    </>
  );
};

export default Home;
