import React, { useState, useCallback, useEffect } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Button,
  Form,
  notification,
} from 'antd';
import { useHistory, useParams } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  __model__, Update__model__Form,
} from '@types';
import __model__Form from 'components/__model__Form';
import LoadingIndicator from 'components/LoadingIndicator/LoadingIndicator';

const Update__model__: React.VC = ({ verboseName, parentName }) => {
  const [form] = Form.useForm();
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [__model__(lowerCase), set__model__] = useState<__model__ | undefined>(undefined);

  const fetch__model__ = useCallback(async () => {
    setLoading(true);

    const [result, error] = await backend.__model__(lowerCase)s.getOne(id);

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
  }, [backend.__model__(lowerCase)s, id]);

  useEffect(() => {
    fetch__model__();
  }, [history, fetch__model__]);

  const onFinishFailed = () : void => {
    notification.error({
      message: '¡Ocurrió un error al intentar guardar!',
      description: 'Intentalo después.',
    });
  };

  const onFinish = async (values: Update__model__Form) : Promise<void> => {
    setLoading(true);
    const [, error] = await backend.__model__(lowerCase)s.updateOne(id, {
      ...values,
    });

    if (error) {
      onFinishFailed();
    } else {
      notification.success({
        message: '¡__model__o modificado exitosamente!',
      });
      form.resetFields();
    }
    setLoading(false);
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Content>
      <Title
        viewName={verboseName}
        parentName={parentName}
      />
      <__model__Form
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        onFinishFailed={onFinishFailed}
        initialState={__model__(lowerCase) as Update__model__Form}
        isUpdate
      />
    </Content>
  );
};

export default Update__model__;
