'use client';
import styled from '@emotion/styled';

const ButtonContainer = styled.button`
  position: relative;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  color: ${(p) => (p.disabled ? p.theme.colors.gray300 : p.theme.colors.gray500)};
  height: 32px;
  min-height: 32px;
  margin: 0 8px 8px 0;
  &:before {
    content: '';
    display: block;
    position: absolute;
    inset: 0;
    top: 0px;
    height: calc(100% - 2px);
    top: 2px;
    transform: translateY(-2px);
    box-shadow: 0 2px 0 0px ${(p) => p.theme.colors.surface100};
    background: ${(p) => p.theme.colors.surface100};
    border-radius: inherit;
  }
  &:after {
    content: '';
    display: block;
    position: absolute;
    inset: 0;
    background: ${(p) => p.theme.colors.surface500};
    border-radius: inherit;
    border: 1px solid ${(p) => p.theme.colors.surface100};
    transform: translateY(-2px);
    transition: transform 0.06s ease-in-out;
  }
  &:hover {
    &::after {
      transform: translateY(calc(-2px - 1px));
    }
    > span:last-child {
      transform: translateY(calc(-2px - 1px));
    }
  }
  &:active,
  &[aria-expanded='true'],
  &[aria-checked='true'] {
    &::after {
      transform: translateY(0px);
    }
    > span:last-child {
      transform: translateY(0px);
    }
  }

  &:disabled,
  &[aria-disabled='true'] {
    &::after {
      transform: translateY(0px);
    }
    > span:last-child {
      transform: translateY(0px);
    }
  }
`;

const ButtonLabel = styled.span`
  z-index: 1;
  position: relative;
  display: inherit;
  align-items: inherit;
  justify-content: inherit;
  flex: 1;
  gap: inherit;
  overflow: hidden;
  white-space: nowrap;
  transform: translateY(-1px);
  transition: transform 0.06s ease-in-out;
`;

import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function Button({ children, ...props }: ButtonProps) {
  return (
    <ButtonContainer {...props}>
      <ButtonLabel>{children}</ButtonLabel>
    </ButtonContainer>
  );
}
