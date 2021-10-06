import React from 'react';
import { Result } from 'antd';

const NotFound: React.FC = () => (
  <Result
    status="404"
    title="Página no encontrada (404)"
    subTitle="Lo sentimos, la página que desea consultar no existe"
  />
);

export default NotFound;
