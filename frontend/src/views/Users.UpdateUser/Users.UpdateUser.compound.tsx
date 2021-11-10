import { Maybe, User } from '@types';
import LoadingIndicator from 'components/LoadingIndicator';
import NotFound from 'components/NotFound';
import { useBackend } from 'integrations';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import UpdateUserComp from './Users.UpdateUser';

const UpdateUser: React.FC = () => {
  const { id } = useParams<{ id: string; }>();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<Maybe<User>>(undefined);
  const backend = useBackend();

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    const [result, error] = await backend.users.getOne(id);

    if (error || !result || !result.data) {
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, [id, backend.users]);

  useEffect(() => {
    fetchUser();
  }, [id, fetchUser]);

  if (isLoading) return <LoadingIndicator />;

  if (!isLoading || !user) return <NotFound />;

  return (<UpdateUserComp user={user} />);
};

export default UpdateUser;
