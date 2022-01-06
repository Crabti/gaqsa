/* eslint-disable react/jsx-props-no-spreading */
import {
  Form, Input, Button, Typography, Col, Space,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';

const AddRanch: React.FC = () => (
  <>
    <Col span={12} offset={4}>
      <Typography>
        Ranchos
      </Typography>
      <Form.List name="ranchs">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({
              key, name, ...restField
            }) => (
              <Space
                key={key}
                align="baseline"
                size="large"
              >
                <Form.Item
                  {...restField}
                  name={[name, 'key']}
                  rules={[{
                    required: true,
                    message: 'Por favor llenar este campo.',
                  }]}
                >
                  <Input
                    placeholder="Clave Interna"
                    style={{ width: 'auto' }}
                  />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'name']}
                  rules={[{
                    required: true,
                    message: 'Por favor llenar este campo.',
                  }]}
                >
                  <Input
                    placeholder="Nombre"
                    style={{ width: 'auto' }}
                  />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Añadir Rancho
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Col>
  </>
);

export default AddRanch;
