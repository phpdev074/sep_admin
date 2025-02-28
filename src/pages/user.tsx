import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserView } from 'src/sections/user/view/user-view';
// import {BlockedUserView} from 'src/sections/user/view/blocked-user'


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserView />
    </>
  );
}

