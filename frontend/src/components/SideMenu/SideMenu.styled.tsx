import { Layout } from 'antd';
import styled from 'styled-components';

export const Sider = styled(Layout.Sider)`
  box-shadow: 0px 1px 3px rgba(0, 0, 0, .05), 0px 0px 5px rgba(0, 0, 0, .03);
  
  .ant-menu {
    background-color: ${({ theme }) => theme.colors.bgContent};
  }
`;
