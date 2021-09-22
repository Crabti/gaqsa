import React from 'react';
import { Button, Row } from 'antd';

type FormButtonProps = {
  text: string,
}

const FormButton: React.FC<FormButtonProps> = (props) => {
  const { text } = props;
  return (
    <Row justify="space-around" align="middle">
      <Button
        type="primary"
        shape="round"
        htmlType="submit"
      >
        { text }
      </Button>
    </Row>
  );
};

export default FormButton;
