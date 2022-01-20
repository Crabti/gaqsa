/* eslint-disable react/jsx-key */
import React from 'react';
import {
  Layout, Breadcrumb, ConfigProvider, Row,
} from 'antd';
import esEs from 'antd/lib/locale/es_ES';
import Header from 'components/Header';
import SideMenu from 'components/SideMenu';
import PrivacyNotice from 'components/PrivacyNotice';
import useNavigation from 'hooks/navigation/useNavigation';
import registerdGroups from 'Routes';
import RoutesComponents from 'Routes/Routes';
import Copyright from 'components/Copyright';
import {
  Content, BaseLayout, ContentLayout, Footer,
} from './App.styled';

const App: React.FC = () => {
  const { viewName, parentName } = useNavigation();
  return (
    <ConfigProvider locale={esEs}>
      <BaseLayout>
        <Header />
        <Layout>
          <SideMenu groups={registerdGroups} />
          <ContentLayout style={{ padding: '0 24px 0px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Gaqsa</Breadcrumb.Item>
              { parentName && <Breadcrumb.Item>{parentName}</Breadcrumb.Item> }
              <Breadcrumb.Item>{viewName}</Breadcrumb.Item>
            </Breadcrumb>
            <Content data-testid="content-container">
              <RoutesComponents groups={registerdGroups} />
            </Content>
            <Footer>
              <Row justify="center">
                <PrivacyNotice />
              </Row>
              <Row justify="center">
                <Copyright />
              </Row>
            </Footer>
          </ContentLayout>
        </Layout>
      </BaseLayout>
    </ConfigProvider>
  );
};

export default App;
