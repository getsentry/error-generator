'use client';

import styled from '@emotion/styled';
import { css, Global, useTheme } from '@emotion/react';

export const Input = styled.input`
  display: block;
  width: 100%;
  color: ${({ theme }) => theme.colors.gray500};
  background: ${({ theme }) => theme.colors.surface400};
  box-shadow: 0px 2px 0px 0px ${({ theme }) => theme.colors.gray300} inset;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  padding: 8px 12px;
  border-radius: 6px;
  resize: vertical;
  transition:
    border 0.1s,
    box-shadow 0.1s;
  cursor: text;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray400};
    opacity: 1;
  }

  &[disabled],
  &[aria-disabled='true'] {
    color: ${({ theme }) => theme.colors.gray300};
    cursor: not-allowed;
    opacity: 0.6;

    &::placeholder {
      color: ${({ theme }) => theme.colors.gray300};
    }
  }

  &:focus,
  &:focus-visible,
  :focus-within {
    outline: 2px solid ${({ theme }) => theme.colors.purple300};
    outline-offset: 2px;
    border-color: ${({ theme }) => theme.colors.purple300};
  }

  &[type='number'] {
    appearance: textfield;
    -moz-appearance: textfield;
    font-variant-numeric: tabular-nums;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export function GlobalStyles() {
  const theme = useTheme();
  return (
    <Global
      styles={css`
        * {
          box-sizing: border-box;
        }
        body {
          background: ${theme.colors.surface400};
          color: ${theme.colors.gray400};
          font-family: 'Rubik', sans-serif;
          font-size: 16px;
        }
      `}
    />
  );
}
