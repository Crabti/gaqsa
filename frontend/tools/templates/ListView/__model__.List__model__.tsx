import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  notification,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  __model__,
} from '@types';
import Table from 'components/Table';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';

const List__model__: React.VC = ({ verboseName, parentName }) => {
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [__model__(lowerCase), set__model__] = useState<__model__[] | undefined>(undefined);

  
  const fetch__model__ = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.__model__(lowerCase).getAll();

    if (error || !result) {
      notification.error({
        message: '',
        description: 'Intentalo más tarde',
      });
      setLoading(false);
      return;
    }
    set__model__(result.data);
    setLoading(false);
  }, [backend.__model__(lowerCase)]);

  useEffect(() => {
    fetch__model__();
  }, [history, fetch__model__]);

  const columns = [];

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      {isLoading || !__model__(lowerCase) ? <LoadingIndicator /> : (
        <>
          <Table
            rowKey={(row) => `${row.id}`}
            data={}
            columns={columns}
          />

        </>
      )}
    </Content>
  );
};

export default List__model__;
