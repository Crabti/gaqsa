import React, { useEffect, useRef } from 'react';
import {
  Form, Input, Select, Button,
} from 'antd';
import { FilterContainer } from './TableFilter.styled';

export interface FormType<T> {
  field: keyof T;
  value: string;
}

export interface Props<T> {
  onFilter: (filtered: T[]) => void;
  fieldsToFilter: {key: keyof T; value: string;}[];
  data: T[];
  filterAny: (data: T[], value: string) => T[];
  useAny?: boolean;
}

const TableFilter = <T extends {[x: string]: any}>({
  onFilter,
  fieldsToFilter,
  data,
  filterAny,
  useAny = false,
}: Props<T>): React.ReactElement<Props<T>> => {
  const searchInputRef = useRef<any>(null);
  const [form] = Form.useForm();

  const filter = (values: FormType<T>): void => {
    const newData = values.field === 'any'
      ? filterAny(data, values.value)
      : data.filter(
        (element) => (
          element[values.field] && element[values.field].toLowerCase().includes(
            values.value.toLowerCase(),
          )
        ),
      );
    onFilter(newData);
  };

  useEffect(() => {
    const callback = (e: KeyboardEvent): void => {
      const isSearch = (event: KeyboardEvent): boolean => (
        event.keyCode === 114
        || (event.ctrlKey && event.key === 'f')
        || (event.metaKey && event.key === 'f')
      );

      if (isSearch(e)) {
        e.preventDefault();
        searchInputRef.current?.focus({
          cursor: 'all',
        });
      }
    };

    window.addEventListener('keydown', callback);

    // remove the event when component unmount
    return () => window.removeEventListener('keydown', callback);
  }, []);

  return (
    <FilterContainer>
      <Form
        form={form}
        layout="vertical"
        name="filter"
        onFinish={(values) => filter({ ...values.filter })}
        autoComplete="off"
        initialValues={useAny ? {
          filter: {
            field: 'any',
          },
        } : {}}
      >
        <Form.Item label="Filtrar por:">
          <Input.Group compact>
            <Form.Item name={['filter', 'field']} noStyle>
              <Select style={{ width: '25%' }}>
                {useAny && (
                  <Select.Option
                    key="any-field"
                    value="any"
                  >
                    Cualquier campo
                  </Select.Option>
                )}
                {fieldsToFilter.map((field) => (
                  <Select.Option
                    key={`${field.key}`}
                    value={`${field.key}`}
                  >
                    {field.value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name={['filter', 'value']} noStyle>
              <Input
                allowClear
                ref={searchInputRef}
                style={{ width: '65%' }}
                onChange={() => filter({ ...form.getFieldValue('filter') })}
              />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '10%' }}
            >
              Buscar
            </Button>
          </Input.Group>
        </Form.Item>
      </Form>
    </FilterContainer>
  );
};

export default TableFilter;
