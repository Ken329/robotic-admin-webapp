import { css } from '@emotion/react';

export const scrollbarStyles = css`
  &::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  /* Firefox scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
`;
