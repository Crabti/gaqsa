import { Content } from 'antd/es/layout/layout';
import Title from 'components/Title';
import React from 'react';
import AnnouncementsCreateComp from './Announcements.Create';

const AnnouncementsCreate: React.VC = ({
  verboseName,
  parentName,
}) => {
  const handleSubmit = (data: any): void => {
    console.log(data);
  };

  return (
    <Content>
      <Title
        viewName={verboseName}
        parentName={parentName}
      />
      <AnnouncementsCreateComp
        handleSubmit={handleSubmit}
      />
    </Content>
  );
};

export default AnnouncementsCreate;
