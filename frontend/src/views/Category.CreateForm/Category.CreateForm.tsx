import React, { useState } from 'react';
import { Content } from 'antd/lib/layout/layout';
import {
  Form,
  notification,
} from 'antd';
import { useHistory } from 'react-router';
import Title from 'components/Title';
import { useBackend } from 'integrations';
import {
  CreateLaboratoryForm,
} from '@types';
import LoadingIndicator from 'components/LoadingIndicator';
import CategoryForm from 'components/CategoryForm';

const INITIAL_STATE : CreateLaboratoryForm = {
  name: '',
};

const CreateForm: React.VC = ({ verboseName, parentName }) => {
  const [form] = Form.useForm();
  const backend = useBackend();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);

  const onFinishFailed = () : void => {
    notification.error({
      message: '¡Ocurrió un error al intentar guardar!',
      description: 'Intentalo después.',
    });
  };

  const onFinish = async (values: CreateLaboratoryForm) : Promise<void> => {
    setLoading(true);
    const [, error] = await backend.laboratory.createOne({
      ...values,
    });

    if (error) {
      onFinishFailed();
    } else {
      notification.success({
        message: 'Categoría registrada exitosamente!',
        description: 'La categoría está disponible a partir de este momento.',
      });
      form.resetFields();
      history.replace('/laboratorios');
    }
    setLoading(false);
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      <CategoryForm
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        onFinishFailed={onFinishFailed}
        initialState={INITIAL_STATE}
      />
    </Content>
  );
};

export default CreateForm;
