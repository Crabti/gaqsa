import { Layout, Menu as MenuAntd } from 'antd';
import styled, { css } from 'styled-components';
import LogoImage from 'static/img/logo.png';

const headerCommonStyles = css`
  background: ${({ theme }) => theme.colors.primary};
  position: relative;
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

export const Logo = styled.div`
  background-image: url(${LogoImage});
  background-repeat: no-repeat;
  background-size: contain;
  transform: scale(1.2); // this is just to adjust the image size
`;
