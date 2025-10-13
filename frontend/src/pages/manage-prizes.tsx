import { CONFIG } from 'src/config-global';

import { ManagePrizesView } from 'src/sections/manage-prizes/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Manage Prizes - ${CONFIG.appName}`}</title>

      <ManagePrizesView />
    </>
  );
}
