import React, { useEffect, useRef } from 'react';
import {
  Form, Input, Select, Button,
} from 'antd';
import { FilterContainer } from './TableFilter.styled';

const TableFilter: React.FC = () => {
  const searchInputRef = useRef<any>(null);

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
        layout="vertical"
        name="filter"
        onFinish={(values) => console.log(values)}
        autoComplete="off"
      >
        <Form.Item label="Filtrar por:">
          <Input.Group compact>
            <Form.Item name={['filter', 'column']} noStyle>
              <Select defaultValue="2" style={{ width: '25%' }}>
                <Select.Option value="1">1</Select.Option>
                <Select.Option value="2">2</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name={['filter', 'value']} noStyle>
              <Input allowClear ref={searchInputRef} style={{ width: '65%' }} />
            </Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '10%' }}>
              Buscar
            </Button>
          </Input.Group>
        </Form.Item>
      </Form>
    </FilterContainer>
  );
};

export default TableFilter;
