import AnnouncementForm from 'components/AnnouncementForm';
import React from 'react';

interface Props {
  handleSubmit(data: any): void;
}

const AnnouncementsCreate: React.FC<Props> = () => (
  <AnnouncementForm />
);

export default AnnouncementsCreate;
