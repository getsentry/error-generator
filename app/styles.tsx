'use client';

import { css, Global, useTheme } from '@emotion/react';

export function GlobalStyles() {
  const theme = useTheme();
  return (
    <Global
      styles={css`
        * {
          box-sizing: border-box;
        }
        body {
          background: ${theme.colors.surface500};
          color: ${theme.colors.gray400};
          font-family: 'Rubik', sans-serif;
          font-size: 16px;
        }
      `}
    />
  );
}
