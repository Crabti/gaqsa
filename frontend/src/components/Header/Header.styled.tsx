import { Layout, Menu as MenuAntd } from 'antd';
import styled, { css } from 'styled-components';
import LogoImage from 'static/img/logo.png';
import { LoginOutlined } from '@ant-design/icons';

const headerCommonStyles = css`
  background: ${({ theme }) => theme.colors.primary};
  position: relative;
`;

export const HeaderCont = styled(Layout.Header)`
  ${headerCommonStyles}
  display: grid;
  grid-template-columns: 3fr 9fr;

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

export const LoginIcon = styled(LoginOutlined)`
  color: ${({ theme }) => theme.colors.bgContent};
  font-size: 2rem;
  cursor: pointer;
`;

export const RightContainer = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  justify-content : flex-end;
  align-items: center;
`;
