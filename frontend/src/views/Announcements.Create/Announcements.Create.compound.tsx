import { Layout } from 'antd';
import Title from 'components/Title';
import React from 'react';
import AnnouncementsCreateComp from './Announcements.Create';

const AnnouncementsCreate: React.VC = ({
  verboseName,
  parentName,
}) => (
  <Layout.Content>
    <Title
      viewName={verboseName}
      parentName={parentName}
    />
    <AnnouncementsCreateComp />
  </Layout.Content>
);

export default AnnouncementsCreate;
