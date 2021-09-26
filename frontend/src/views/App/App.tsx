/* eslint-disable react/jsx-key */
import React from 'react';
import {
  Layout, Breadcrumb, ConfigProvider,
} from 'antd';
import esEs from 'antd/lib/locale/es_ES';
import Header from 'components/Header';
import SideMenu from 'components/SideMenu';
import registerdGroups from 'Routes';
import RoutesComponents from 'Routes/Routes';
import { Content, BaseLayout } from './App.styled';

const App: React.FC = () => (
  <ConfigProvider locale={esEs}>
    <BaseLayout>
      <Header />
      <Layout>
        <SideMenu groups={registerdGroups} />
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            data-testid="content-container"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <RoutesComponents groups={registerdGroups} />
          </Content>
        </Layout>
      </Layout>
    </BaseLayout>
  </ConfigProvider>
);

export default App;
