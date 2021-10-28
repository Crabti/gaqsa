import { Layout } from 'antd';
import styled, { css } from 'styled-components';
import LogoImage from 'static/img/logo.png';

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

export const Logo = styled.div`
  background-image: url(${LogoImage});
  background-repeat: no-repeat;
  background-size: contain;
  transform: scale(1.2); // this is just to adjust the image size
`;

export const RightContainer = styled.div`
  color: ${({ theme }) => theme.colors.bgContent};

  a {
    color: ${({ theme }) => theme.colors.bgContent};
  }

  .username {
    margin-right: 2em;
    color: white;
  }

  font-size: 1rem;
  position: relative;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
