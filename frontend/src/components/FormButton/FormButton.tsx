import React from 'react';
import { Button, Row } from 'antd';

type FormButtonProps = {
  text: string,
  loading: boolean,
};

const FormButton: React.FC<FormButtonProps> = (props) => {
  const { text, loading } = props;
  return (
    <Row justify="space-around" align="middle">
      <Button
        type="primary"
        shape="round"
        htmlType="submit"
        loading={loading}
      >
        { text }
      </Button>
    </Row>
  );
};

export default FormButton;
