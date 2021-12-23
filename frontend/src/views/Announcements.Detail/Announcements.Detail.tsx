import { Announcement } from '@types';
import { Descriptions, Typography } from 'antd';
import React from 'react';

interface Props {
  announcement: Announcement;
}

const AnnouncementsDetail: React.FC<Props> = ({
  announcement,
}) => (
  <Descriptions
    bordered
    layout="vertical"
  >
    <Descriptions.Item
      label="Título"
      span={1}
    >
      {announcement.title}
    </Descriptions.Item>
    <Descriptions.Item
      span={1}
      label="Archivo Adjunto"
    >
      <Typography.Link href={announcement.file_url}>
        Enlace a archivo
      </Typography.Link>
    </Descriptions.Item>
    <Descriptions.Item label="Contenido" span={2}>
      {announcement.content}
    </Descriptions.Item>
  </Descriptions>
);

export default AnnouncementsDetail;
