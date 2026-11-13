import { css } from '@emotion/react';

// Hide the scrollbar visually (content stays scrollable) so it never
// flickers or shifts the layout.
export const scrollbarStyles = css`
  &::-webkit-scrollbar {
    display: none;
  }

  /* Firefox */
  scrollbar-width: none;
  /* Legacy Edge / IE */
  -ms-overflow-style: none;
`;
