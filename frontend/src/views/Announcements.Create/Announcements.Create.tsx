import React from 'react';

interface Props {
  handleSubmit(data: any): void;
}

const AnnouncementsCreate: React.FC<Props> = () => (
  <div>Nuevo</div>
);

export default AnnouncementsCreate;
