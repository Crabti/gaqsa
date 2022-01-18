import { Layout } from 'antd';
import styled from 'styled-components';

export const BaseLayout = styled(Layout)`
  min-height: 100vh;
`;

export const Content = styled(Layout.Content)`
  background-color: ${(props) => props.theme.colors.bgContent};
  border-radius: 5px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, .05), 0px 0px 5px rgba(0, 0, 0, .03);
  padding: 24px;
  margin: 0;
`;

export const ContentLayout = styled(Layout)`
  padding: 0 24px 24px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Footer = styled(Layout.Footer)`
  margin: 0;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background};
`;
