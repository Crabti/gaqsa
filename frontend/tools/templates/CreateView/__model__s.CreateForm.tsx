import React, { useState } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Form,
  notification,
} from 'antd';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  Create__model__Form,
} from '@types';
import __model__Form from 'components/__model__Form';

const INITIAL_STATE : Create__model__Form = {
};

const Create__model__: React.VC = ({ verboseName, parentName }) => {
  const [form] = Form.useForm();
  const backend = useBackend();
  const [isLoading, setLoading] = useState(false);

  const onFinishFailed = (code: string) : void => {
    switch (code) {
      default:
        notification.error({
          message: '¡Ocurrió un error al intentar guardar!',
          description: 'Intentalo después.',
        });
        break;
    }
  };

  const onFinish = async (values: Create__model__Form) : Promise<void> => {
    setLoading(true);

    const [, error] = await backend.__model__(lowerCase)s.createOne({
      ...values,
    });
    if (error) {
      onFinishFailed(error.response?.data.code);
    } else {
      notification.success({
        message: '',
        description: ''
      });
      form.resetFields();
    }
    setLoading(false);
  };

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      <__model__Form
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        onFinishFailed={onFinishFailed}
        initialState={INITIAL_STATE}
      />
    </Content>
  );
};

export default Create__model__;
