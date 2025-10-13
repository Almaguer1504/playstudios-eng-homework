import type { LinkProps } from '@mui/material/Link';

import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export function Logo({
  sx,
  disabled,
  className,
  href = '/',
  isSingle = true,
  ...other
}: LogoProps) {

  const singleLogo = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 190 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fillRule="evenodd" clipRule="evenodd"><path d="M0 0h192.756v192.756H0V0z"/><path d="M186.686 88.894h-47.174v37.503h50.41v-13.346h-32.303V100.91h29.066V88.894h.001zm-47.174-22.533v13.038h49.674V66.361h-49.674zM102.6 66.361H74.087v12.152h29.395c3.447 0 5.488 3.587 5.488 5.93 0 2.249-2.043 5.596-5.488 5.596H74.087v14.23h28.415c2.416 0 4.705 1.789 4.705 3.418 0 1.533-2.484 3.74-5.098 3.74H73.94v14.969h31.782c13.773 0 24.029-2.975 24.029-16.41 0-5.762-3.16-13.56-12.256-15.553 6.301-3.207 9.447-6.618 9.447-11.853.001-12.53-6.635-16.219-24.342-16.219zM28.874 66.361l15.238 44.385H26.405l8.067-24.952H18.164l-15.33 40.602h65.573L45.984 66.361h-17.11z" fill="#147cc2"/></g>
    </svg>
  );

  const fullLogo = (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 360 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fillRule="evenodd" clipRule="evenodd"><path d="M0 0h192.756v192.756H0V0z"/><path d="M186.686 88.894h-47.174v37.503h50.41v-13.346h-32.303V100.91h29.066V88.894h.001zm-47.174-22.533v13.038h49.674V66.361h-49.674zM102.6 66.361H74.087v12.152h29.395c3.447 0 5.488 3.587 5.488 5.93 0 2.249-2.043 5.596-5.488 5.596H74.087v14.23h28.415c2.416 0 4.705 1.789 4.705 3.418 0 1.533-2.484 3.74-5.098 3.74H73.94v14.969h31.782c13.773 0 24.029-2.975 24.029-16.41 0-5.762-3.16-13.56-12.256-15.553 6.301-3.207 9.447-6.618 9.447-11.853.001-12.53-6.635-16.219-24.342-16.219zM28.874 66.361l15.238 44.385H26.405l8.067-24.952H18.164l-15.33 40.602h65.573L45.984 66.361h-17.11z" fill="#147cc2"/></g>
    </svg>
  );

  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: 40,
          height: 40,
          ...(!isSingle && { width: 102, height: 36 }),
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {isSingle ? singleLogo : fullLogo}
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));
