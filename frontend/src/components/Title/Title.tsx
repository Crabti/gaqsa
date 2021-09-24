import React, { useEffect } from 'react';
import { Typography } from 'antd';

type TitleProps = {
  text: string,
};

const Title: React.FC<TitleProps> = (props) => {
  const { text } = props;

  useEffect(() => {
    document.title = `${document.title} - ${text}`;
  }, [text]);

  return (
    <Typography style={{marginBottom: 50}}>
      <Typography.Title level={4}>
        { text }
      </Typography.Title>
    </Typography>
  );
};

export default Title;
