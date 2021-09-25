import React from 'react';
import {
  Row,
  Spin,
} from 'antd';
import { Content } from 'antd/lib/layout/layout';

const LoadingIndicator : React.FC = () => (
  <Content>
    <Row align="middle" justify="center" style={{ height: '50vh' }}>
      <Spin size="large" tip="Cargando..." />
    </Row>
  </Content>
);

export default LoadingIndicator;
