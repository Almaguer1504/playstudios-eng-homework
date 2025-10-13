import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const adminNavData = [
  {
    title: 'Home',
    path: '/',
    icon: icon('ic-home'),
  },
  {
    title: 'Users',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Prizes',
    path: '/manage-prizes',
    icon: icon('ic-disabled')
  }
];

export const generalNavData = [
  {
    title: 'Home',
    path: '/',
    icon: icon('ic-home'),
  },
  {
    title: 'Prizes',
    path: '/products',
    icon: icon('ic-cart'),
  },
  {
    title: 'Sign in',
    path: '/sign-in',
    icon: icon('ic-lock'),
  }
];
