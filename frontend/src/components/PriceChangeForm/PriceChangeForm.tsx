/* eslint-disable react/jsx-props-no-spreading */
import {
  Col,
  Form, Input, InputNumber, Row, Typography,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import TableFilter from 'components/TableFilter';
import { Product } from '@types';
import DiscountText from 'components/DiscountText';
import Table from 'components/Table';
import FormButton from 'components/FormButton';
import LoadingIndicator from 'components/LoadingIndicator';
import Props from './PriceChangeForm.type';

const PriceChangeForm: React.FC<Props> = ({
  form,
  onFinish,
  onFinishFailed,
  isLoading,
  products,
}) => {
  const [filtered, setFiltered] = useState<Product[]>([]);
  const resetFiltered = useCallback(
    () => setFiltered(products || []), [products],
  );

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Presentación',
      dataIndex: 'presentation',
      key: 'presentation',
    },
    {
      title: 'Substancia activa',
      dataIndex: 'active_substance',
      key: 'active_substance',
    },
    {
      title: 'Laboratorio',
      dataIndex: 'laboratory',
      key: 'laboratory',
    },
    {
      title: 'Categoría',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (_: number, product: Product) => (
        <DiscountText
          originalPrice={product.price}
          discount={product.offer?.discount_percentage}
        />
      ),
    },
    {
      title: 'Nuevo Precio',
      dataIndex: 'new_price',
      key: 'new_price',
      render: (fieldKey: number, product: Product) => (
        <>
          <Form.Item
            name={['products', product.id, 'new_price']}
          >
            <InputNumber
              size="small"
              min={0.01}
              formatter={(value) => `$${value}`.replace(
                /\B(?=(\d{3})+(?!\d))/g, ',',
              )}
            />
          </Form.Item>
          <Form.Item
            name={['products', product.id, 'product']}
            initialValue={product.id}
            hidden

          />
        </>
      ),
    },
  ];

  const onFilterAny = (
    data: Product[], value: string,
  ): Product[] => data.filter((product) => (
    product.name.toLowerCase().includes(
      value.toLowerCase(),
    )
    || product.provider?.toLowerCase().includes(
      value.toLowerCase(),
    )
    || product.presentation.toLowerCase().includes(
      value.toLowerCase(),
    )
    || product.active_substance.toLowerCase().includes(
      value.toLowerCase(),
    )
    || (
      typeof product.category === 'string'
      && product.category.toLowerCase().includes(
        value.toLowerCase(),
      )
    )
    || (
      typeof product.laboratory === 'string'
      && product.laboratory.toLowerCase().includes(
        value.toLowerCase(),
      )
    )
  ));

  useEffect(() => {
    resetFiltered();
  }, [products, resetFiltered]);

  return (
    <Form
      form={form}
      name="PriceChangeForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Row justify="center">
        <Col span={6}>
          <Typography>
            Código para Cambio de Precio
          </Typography>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={6}>
          <Form.Item
            name="token"
            rules={[{ required: true }]}
          >
            <Input size="small" />
          </Form.Item>
        </Col>
      </Row>
      { products ? (
        <>
          <TableFilter
            useAny
            fieldsToFilter={[
              { key: 'name', value: 'Nombre' },
              { key: 'provider', value: 'Proveedor' },
              { key: 'presentation', value: 'Presentación' },
              { key: 'active_substance', value: 'Substancia activa' },
              { key: 'laboratory', value: 'Laboratorio' },
              { key: 'category', value: 'Categoria' },
            ]}
            onFilter={setFiltered}
            filterAny={onFilterAny}
            data={products}
          />
          <Table
            rowKey={(row) => `${row.id}`}
            data={filtered}
            columns={columns}
          />
        </>
      ) : <LoadingIndicator />}
      <FormButton
        loading={isLoading}
        text="Confirmar"
      />
    </Form>
  );
};

export default PriceChangeForm;
