/* eslint-disable react/jsx-props-no-spreading */
import {
  Form, Input, Button, Typography, Col, Row,
} from 'antd';
import './index.css';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';
import Props from './AddMail.type';

const AddMail: React.FC<Props> = ({
  category,
  placeholder,
  addLabel,
  title,
  listName,
}) => (
  <Col span={12}>
    <Row justify="center">
      <Typography>
        { title }
      </Typography>
    </Row>
    <Form.List
      name={listName}
      rules={[
        {
          validator: async (_, names) => {
            if (!names || names.length < 1) {
              return Promise.reject(
                new Error('Por favor ingresar al menos un correo electrónico.'),
              );
            }
            return Promise.resolve();
          },
        },
      ]}
    >
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map(({
            key, name, fieldKey, ...restField
          }) => (
            <Row gutter={24} justify="center" key={key}>
              <Form.Item
                {...restField}
                name={[name, 'email']}
                fieldKey={[fieldKey, 'email']}
                validateTrigger={['onChange', 'onBlur']}
                id={`${category}-${fieldKey}`}
                rules={[
                  {
                    required: true,
                    type: 'email',
                    message: 'Por favor ingresar un '
                      + 'correo electrónico valido.',
                  },
                ]}
              >
                <Input
                  placeholder={placeholder}
                  style={{ width: 'auto' }}
                />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'category']}
                fieldKey={[fieldKey, 'category']}
                hidden
                initialValue={category}
              />
              <Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(name)}
                  />
                ) : null}
              </Form.Item>
            </Row>
          ))}
          <Row justify="center">
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                { addLabel }
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </Row>
        </>
      )}
    </Form.List>
  </Col>
);

export default AddMail;
