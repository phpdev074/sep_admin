import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic-analytics'),
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'BLocked User',
    path: '/blockedUser',
    icon: icon('ic-block'),
  },
  {
    title: 'Deleted Users',
    path: '/deletedUser',
    icon: icon('ic-block'),
  },
  {
    title: 'Post',
    path: '/post',
    icon: icon('ic-post'),
  },
  {
    title: 'Report Post',
    path: '/reportpost',
    icon: icon('ic-report'),
  },
  {
    title: 'Add Product',
    path: '/products',
    icon: icon('ic-cart'),
  },
  {
    title: 'Settings',
    path: '/setting',
    icon: icon('ic-setting'),
  },
  // {
  //   title: 'Sign in',
  //   path: '/sign-in',
  //   icon: icon('ic-lock'),
  // },
  
];
