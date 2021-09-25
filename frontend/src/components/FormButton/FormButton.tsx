import React from 'react';
import { Button, Row, Form } from 'antd';

type FormButtonProps = {
  text: string,
  loading: boolean,
};

const FormButton: React.FC<FormButtonProps> = (props) => {
  const { text, loading } = props;
  return (
    <Row justify="space-around" align="middle">
      <Form.Item shouldUpdate className="submit">
        <Button
          type="primary"
          shape="round"
          htmlType="submit"
          style={{ marginTop: 50 }}
          loading={loading}
        >
          { text }
        </Button>
      </Form.Item>
    </Row>
  );
};

export default FormButton;
