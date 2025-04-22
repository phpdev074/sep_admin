import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DeleteView } from 'src/sections/deletedAccount/view/deletedUser';
// import {BlockedUserView} from 'src/sections/user/view/blocked-user'


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`block Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <DeleteView />
    </>
  );
}

