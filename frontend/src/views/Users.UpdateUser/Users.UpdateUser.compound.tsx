import { Maybe, UpdateUserForm, User } from '@types';
import { Content } from 'antd/lib/layout/layout';
import {
  Form, notification,
} from 'antd';
import LoadingIndicator from 'components/LoadingIndicator';
import NotFound from 'components/NotFound';
import Title from 'components/Title';
import UserForm from 'components/UserForm';
import { useBackend } from 'integrations';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { usersRoutes } from 'Routes';
import { UserGroups } from 'hooks/useAuth';

const UpdateUserCompound: React.VC = ({ parentName }) => {
  const { id } = useParams<{ id: string; }>();
  const [isLoading, setIsLoading] = useState(true);
  const [form] = Form.useForm();
  const [user, setUser] = useState<Maybe<User>>(undefined);
  const backend = useBackend();
  const history = useHistory();

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    const [result, error] = await backend.users.getOne(id);

    if (error || !result || !result.data) {
      setIsLoading(false);
      return;
    }
    setUser(result.data);
    setIsLoading(false);
  }, [backend.users, id]);

  useEffect(() => {
    fetchUser();
  }, [id, fetchUser]);

  if (isLoading) return <LoadingIndicator />;

  if (!user) return <NotFound />;

  const INITIAL_STATE : UpdateUserForm = {
    user: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    },
    profile: user.profile,
    business: user.provider ? user.provider : user.client,
  };

  const onFinishFailed = (code: string) : void => {
    switch (code) {
      case 'USER_ALREADY_EXISTS':
        notification.error({
          message: 'El nombre de usuario ya existe.',
          description: 'Prueba con otro nombre de usuario.',
        });
        form.setFields([{
          name: ['user', 'username'],
          errors: ['El nombre de usuario ya existe.'],
        }]);
        form.scrollToField(['user', 'username']);
        break;
      default:
        notification.error({
          message: '¡Ocurrió un error al intentar guardar!',
          description: 'Intentalo después.',
        });
        break;
    }
  };

  const onFinish = async (values: UpdateUserForm) : Promise<void> => {
    setIsLoading(true);
    let payload : UpdateUserForm;
    const group = user.groups[0];
    switch (group) {
      case UserGroups.PROVIDER:
        payload = {
          user: values.user,
          profile: values.profile,
          provider: values.business,
        };
        break;
      case UserGroups.CLIENT:
        payload = {
          user: values.user,
          profile: values.profile,
          client: values.business,
        };
        break;
      default:
        payload = {
          user: values.user,
          profile: values.profile,
        };
        break;
    }
    const [, error] = await backend.users.updateOne(
      id,
      payload,
    );
    if (error) {
      onFinishFailed(error.response?.data.code);
    } else {
      notification.success({
        message: `El usuario ${user.username} se ha modificado exitosamente!`,
      });
      form.resetFields();
      history.replace(usersRoutes.listUsers.path);
    }
    setIsLoading(false);
  };

  return (
    <Content>
      <Title parentName={parentName} viewName={`Modificar ${user.username}`} />
      <UserForm
        initialState={INITIAL_STATE}
        initialRole={user.groups[0]}
        isUpdate
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        isLoading={isLoading}
        form={form}
      />
    </Content>
  );
};

export default UpdateUserCompound;
