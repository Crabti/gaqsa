import { User } from '@types';
import React from 'react';

interface Props {
  user: User;
}

const UpdateUser: React.FC<Props> = ({ user }) => (
  <>
    {user.first_name}
    {' '}
    {user.last_name}
  </>
);

export default UpdateUser;
