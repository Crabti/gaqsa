import { Layout, Menu as MenuAntd } from 'antd';
import styled, { css } from 'styled-components';

const headerCommonStyles = css`
  background: ${({ theme }) => theme.colors.primary};
`;

export const HeaderCont = styled(Layout.Header)`
  ${headerCommonStyles}
  display: grid;
  grid-template-columns: 3fr 5fr 6fr;

  ul.ant-menu.ant-menu-dark {
    ${headerCommonStyles}
  }
`;

export const Menu = styled(MenuAntd)`
  display: flex;
  align-items: flex-end;
`;
