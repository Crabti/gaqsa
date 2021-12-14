import { Button } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Title from 'components/Title';
import React from 'react';
import { useHistory } from 'react-router';
import { catalogsRoutes } from 'Routes';

const AnnouncementsList: React.VC = ({
  verboseName,
  parentName,
}) => {
  const history = useHistory();

  const onExtraClick = (): void => {
    history.push(catalogsRoutes.createAnnouncement.path);
  };

  return (
    <Content>
      <Title
        viewName={verboseName}
        parentName={parentName}
        extra={
          [
            (
              <Button type="primary" onClick={onExtraClick}>
                Crear nueva circular
              </Button>
            ),
          ]
        }
      />
    </Content>
  );
};

export default AnnouncementsList;
