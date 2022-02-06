import { Announcement } from '@types';
import { Content } from 'antd/lib/layout/layout';
import LoadingIndicator from 'components/LoadingIndicator';
import NotFound from 'components/NotFound';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AnnouncementsDetail
  from 'views/Announcements.Detail/Announcements.Detail';

const AnnouncementsDetailCompound: React.VC = ({
  parentName,
}) => {
  const { id } = useParams<{ id: string }>();
  const backend = useBackend();
  const [loading, setLoading] = useState(true);
  const [announ, setAnnoun] = useState<Announcement | undefined>(
    undefined,
  );

  useEffect(() => {
    setLoading(true);
    const fetchData = async (): Promise<void> => {
      const [res, err] = await backend.announcements.getOne(id);

      if (err || !res || !res.data) {
        setLoading(false);
        return;
      }

      setAnnoun(res.data);
      setLoading(false);
    };

    fetchData();
  }, [backend.announcements, id]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!announ) {
    return <NotFound />;
  }

  return (
    <Content>
      <Title
        viewName={announ ? announ.title : 'Circular'}
        parentName={parentName}
      />
      <AnnouncementsDetail announcement={announ} />
    </Content>
  );
};

export default AnnouncementsDetailCompound;
