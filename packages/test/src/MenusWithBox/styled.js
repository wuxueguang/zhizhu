
import styled, { createGlobalStyle, css } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
  }
`;

const rowFlexBox = css`
  display: flex;
  flex-direction: row;
`;

const columnFlexBox = css`
  display: flex;
  flex-direction: column;
`;

export const Box = styled.div`
  ${rowFlexBox};

  height: 100vh;

  .left-box{
    ${columnFlexBox};

    width: 64px;

    &.expanded{
      width: 200px;
    }

    height: 100%auto;
    background: rgb(0, 12, 23);
  }

  .right-box{
    flex-grow: 1;
    height: 100%;
  }

`;
