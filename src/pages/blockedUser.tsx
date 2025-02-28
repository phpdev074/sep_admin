import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BlockView } from 'src/sections/blockUser/view/blockedUser';
// import {BlockedUserView} from 'src/sections/user/view/blocked-user'


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`block Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <BlockView />
    </>
  );
}

