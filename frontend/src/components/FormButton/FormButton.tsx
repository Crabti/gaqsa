import React from 'react';
import { Button, Row, Form } from 'antd';
import { Props } from './FormButton.type';

const FormButton: React.FC<Props> = (props) => {
  const { text, loading, disabled } = props;
  return (
    <Row justify="space-around" align="middle">
      <Form.Item shouldUpdate className="submit">
        <Button
          type="primary"
          shape="round"
          htmlType="submit"
          style={{ marginTop: 50 }}
          loading={loading}
          disabled={disabled}
        >
          { text }
        </Button>
      </Form.Item>
    </Row>
  );
};

export default FormButton;
