'use client';

import styled from '@emotion/styled';

export const Input = styled.input`
  display: block;
  margin: 0 8px 8px 0;
  font-family: inherit;
  font-size: inherit;
  width: 100%;
  color: ${({ theme }) => theme.colors.gray500};
  background: ${({ theme }) => theme.colors.surface400};
  box-shadow: 0px 2px 0px 0px ${({ theme }) => theme.colors.surface100} inset;
  border: 1px solid ${({ theme }) => theme.colors.surface100};
  padding: 8px 12px;
  border-radius: 6px;
  resize: vertical;
  transition: all 0.1s;
  cursor: text;
  outline: 2px solid transparent;
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray300};
    opacity: 0.8;
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
    outline-color: ${({ theme }) => theme.colors.purple300};
  }
`;
