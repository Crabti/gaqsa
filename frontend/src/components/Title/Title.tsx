import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import useNavigation from 'hooks/navigation';
import { PageHeader } from './Title.styled';
import { TitleProps } from './Title.type';

const Title: React.FC<TitleProps> = ({ viewName, parentName, extra }) => {
  const { setViewName, setParentName } = useNavigation();
  const history = useHistory();

  useEffect(() => {
    if (parentName) {
      document.title = `Gaqsa | ${parentName} | ${viewName}`;
    } else {
      document.title = `Gaqsa | ${viewName}`;
    }
    setViewName(viewName);
    setParentName(parentName);
  }, [setViewName, setParentName, viewName, parentName]);

  return (
    <PageHeader
      onBack={() => history.goBack()}
      title={viewName}
      extra={extra}
    />
  );
};

export default Title;
