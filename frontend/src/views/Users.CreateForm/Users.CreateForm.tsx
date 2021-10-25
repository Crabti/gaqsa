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
  CreateUserForm,
  UserEmail,
} from '@types';
import UserForm from 'components/UserForm';

import { UserGroups } from 'hooks/useAuth';
import { usersRoutes } from 'Routes';

const INITIAL_STATE : CreateUserForm = {
  user: {
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  },
  profile: { telephone: '' },
  ranchs: [],
  business: {
    dimension: '',
    internal_key: '',
    invoice_telephone: '',
    nav_key: '',
    name: '',
    rfc: '',
  },
  orderMails: [],
  invoiceMails: [],
  priceChangeMails: [],
  paymentMails: [],
  group: UserGroups.PROVIDER,
};

const CreateUser: React.VC = ({ verboseName, parentName }) => {
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

  const onFinish = async (values: CreateUserForm) : Promise<void> => {
    setLoading(true);
    const {
      user, profile, business, group, ranchs,
    } = values;

    let emails : UserEmail[] = [];
    if (values.invoiceMails !== undefined) {
      emails = emails.concat(values.invoiceMails);
    }
    if (values.orderMails !== undefined) {
      emails = emails.concat(values.orderMails);
    }
    if (values.paymentMails !== undefined) {
      emails = emails.concat(values.paymentMails);
    }
    if (values.priceChangeMails !== undefined) {
      emails = emails.concat(values.priceChangeMails);
    }
    let payload : CreateUserForm;
    if (group === UserGroups.PROVIDER) {
      payload = {
        group,
        emails,
        user,
        profile,
        provider: business,
      };
    } else if (group === UserGroups.CLIENT) {
      payload = {
        group,
        emails,
        user,
        profile,
        client: business,
        ranchs,
      };
    } else {
      payload = {
        group,
        emails,
        user,
        profile,
      };
    }
    const [, error] = await backend.users.createOne({
      ...payload,
    });
    if (error) {
      onFinishFailed();
    } else {
      notification.success({
        message: '¡Nuevo usuario creado exitosamente!',
        description: 'El nuevo usuario podra acceder al'
        + ' sistema utilizando los datos de acceso proporcionados.',
      });
      form.resetFields();
      history.replace(usersRoutes.listUsers.path);
    }
    setLoading(false);
  };

  return (
    <Content>
      <Title viewName={verboseName} parentName={parentName} />
      <UserForm
        form={form}
        onFinish={onFinish}
        isLoading={isLoading}
        onFinishFailed={onFinishFailed}
        initialState={INITIAL_STATE}
      />
    </Content>
  );
};

export default CreateUser;
