import { useBackend } from 'integrations';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';

const UpdateUser: React.FC = () => {
  const { id } = useParams<{ id: string; }>();
  const [loading, setLoading] = useState(false);
  const backend = useBackend();

  const fetchUser = async (): Promise<void> => {
    setLoading(true);
    const [result, error] = await backend.users.getOne(id);

    if (error || !result || !result.data) {
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [id, fetchUser]);

  return (<></>);
};

export default UpdateUser;
