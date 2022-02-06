import { SearchOutlined } from '@ant-design/icons';
import { Announcement } from '@types';
import { Button, Tooltip, Typography } from 'antd';
import { useHistory } from 'react-router';
import Table, { Column } from 'components/Table';
import React from 'react';
import LoadingIndicator from 'components/LoadingIndicator';
import moment from 'moment';

interface Props {
  data: Announcement[];
  loading: boolean;
}

const AnnouncementsList: React.FC<Props> = ({ data, loading }) => {
  const history = useHistory();

  const CONTENT_LIMIT = 70;
  const columns: Column[] = [
    {
      title: 'Fecha de creación',
      dataIndex: 'created_at',
      key: 'created_at',
      defaultSortOrder: 'descend',
      sorter: (a: any, b: any) => moment(
        a.created_at,
      ).unix() - moment(
        b.created_at,
      ).unix(),
      render: (_: number, announ: Announcement) => (
        moment(announ.created_at).format('YYYY-MM-DD hh:mm')
      ),
    },
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Contenido',
      dataIndex: 'content',
      key: 'content',
      render: (_: number, announ: Announcement) => (
        `${announ.content.substr(0, CONTENT_LIMIT)}`
        + `${announ.content.length > CONTENT_LIMIT ? '...' : ''}`
      ),
    },
    {
      title: 'Enlace a archivo',
      dataIndex: 'file_url',
      key: 'file_url',
      render: (_: number, announ: Announcement) => (
        <Typography.Link
          href={announ.file_url}
        >
          Archivo adjunto
        </Typography.Link>
      ),
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: number, announ: Announcement) => (
        <Tooltip title="Ver detalles">
          <Button
            shape="circle"
            icon={<SearchOutlined />}
            onClick={() => history.push(`circulares/${announ.id}`)}
          />
        </Tooltip>
      ),
    },
  ];
  if (loading) return <LoadingIndicator />;
  return (
    <Table columns={columns} data={data} rowKey={(record) => record.id} />
  );
};

export default AnnouncementsList;
