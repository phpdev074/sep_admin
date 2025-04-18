import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

import { RouterLink } from 'src/routes/components';

import { stylesMode } from 'src/theme/styles';

import { Logo } from 'src/components/logo';

import { Main } from './main';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';

// ----------------------------------------------------------------------

export type AuthLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function AuthLayout({ sx, children, header }: AuthLayoutProps) {
  const layoutQuery: Breakpoint = 'md';

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: { maxWidth: false },
            toolbar: { sx: { bgcolor: 'transparent', backdropFilter: 'unset' } },
          }}
          sx={{
            position: { [layoutQuery]: 'fixed' },

            ...header?.sx,
          }}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea:(  <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              width: '100%', 
              height: '100%'
            }}> 
             <img 
            src="/assets/icons/glass/logo.png" 
            alt="logo" 
            style={{ 
              maxWidth: '100%', 
              height: '160px', 
              width: '160px',
              marginTop: '170px' 
            }} 
          />
          </div>
            ),
            // rightArea: (
            //   <Link
            //     component={RouterLink}
            //     href="#"
            //     color="inherit"
            //     sx={{ typography: 'subtitle2' }}
            //   >
            //     Need help?
            //   </Link>
            // ),
          }}
        />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{ '--layout-auth-content-width': '420px' }}
      sx={{
        '&::before': {
          width: 1,
          height: 1,
          zIndex: -1,
          content: "''",
          // opacity: 0.24,
          position: 'fixed',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          // backgroundPosition: 'center center',
          // backgroundImage: `url(/assets/background/overlay.jpg)`,
          backgroundColor: 'white',
          [stylesMode.dark]: { opacity: 0.08 },
        },
        ...sx,
      }}
    >
      <Main style={{marginTop:"150px"}} layoutQuery={layoutQuery}>{children}</Main>
    </LayoutSection>
  );
}
