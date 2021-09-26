import React, { useEffect } from 'react';
import { Typography } from 'antd';
import useNavigation from 'hooks/navigation';

interface TitleProps {
  viewName: string;
  parentName: string;
}

const Title: React.FC<TitleProps> = ({ viewName, parentName }) => {
  const { setViewName, setParentName } = useNavigation();

  useEffect(() => {
    document.title = `Gaqsa | ${parentName} | ${viewName}`;
    setViewName(viewName);
    setParentName(parentName);
  }, [setViewName, setParentName, viewName, parentName]);

  return (
    <Typography style={{ marginBottom: 50 }}>
      <Typography.Title level={4}>
        { viewName }
      </Typography.Title>
    </Typography>
  );
};

export default Title;
