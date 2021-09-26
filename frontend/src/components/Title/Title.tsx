import React, { useEffect } from 'react';
import { Typography } from 'antd';

type TitleProps = {
  viewName: string,
};

const Title: React.FC<TitleProps> = (props) => {
  const { viewName } = props;

  useEffect(() => {
    document.title = `Gaqsa | ${viewName}`;
  }, [viewName]);

  return (
    <Typography style={{ marginBottom: 50 }}>
      <Typography.Title level={4}>
        { viewName }
      </Typography.Title>
    </Typography>
  );
};

export default Title;
