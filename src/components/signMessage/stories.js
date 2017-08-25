import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SignMessage from './signMessage';


const publicKey = 'c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f';
const account = {
  passphrase: 'wagon stock borrow episode laundry kitten salute link globe zero feed marble',
  publicKey,
};

storiesOf('SignMessage', module)
  .add('default', () => (
    <SignMessage
      account={account}
      closeDialog={action('closeDialog')}
      successToast={action('succesToast')}
    />
  ));
