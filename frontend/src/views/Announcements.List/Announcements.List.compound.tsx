import { Announcement } from '@types';
import { Button } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Title from 'components/Title';
import useAuth from 'hooks/useAuth';
import { useBackend } from 'integrations';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { catalogsRoutes } from 'Routes';
import AnnouncementsList from 'views/Announcements.List/Announcements.List';

const AnnouncementsListCompound: React.VC = ({
  verboseName,
  parentName,
}) => {
  const history = useHistory();
  const backend = useBackend();
  const user = useAuth();
  const [announs, setAnnouns] = useState<Announcement[]>([]);

  const onExtraClick = (): void => {
    history.push(catalogsRoutes.createAnnouncement.path);
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const [res, err] = await backend.announcements.getAll();

      if (err || !res || !res.data) {
        return;
      }

      setAnnouns(res.data);
    };

    fetchData();
  }, [backend.announcements]);

  return (
    <Content>
      <Title
        viewName={verboseName}
        parentName={parentName}
        extra={
          [
            user.isAdmin && (
              <Button type="primary" onClick={onExtraClick}>
                Crear circular
              </Button>
            ),
          ]
        }
      />
      <AnnouncementsList data={announs} />
    </Content>
  );
};

export default AnnouncementsListCompound;
