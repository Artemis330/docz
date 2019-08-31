/** @jsx jsx */
import * as React from 'react';
import { jsx, SxProps } from 'theme-ui';
import get from 'lodash/get';
import { Theme } from '../../types';

const styles = {
  iframe: (showingCode: boolean, height = 'auto') =>
    ({
      height,
      display: 'block',
      minHeight: '100%',
      width: 'calc(100% - 2px)',
      border: (t: Theme) =>
        `1px solid ${get(t, 'colors.playground.border', 'none')}`,
      borderRadius: showingCode ? '4px 4px 0 0' : '4px',
    } as SxProps['sx']),
};
type Props = { showingCode: boolean };

export const LivePreviewWrapper: React.FC<Props> = ({
  children,
  showingCode,
}) => {
  return <div sx={styles.iframe(showingCode)}>{children}</div>;
};
