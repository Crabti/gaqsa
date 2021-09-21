import { Layout } from 'antd';
import styled from 'styled-components';

export const Content = styled(Layout.Content)`
  background-color: ${(props) => props.theme.colors.bgContent};
`;
