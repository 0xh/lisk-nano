import { configure } from '@storybook/react';
import '../src/components/app/app.css';

function loadStories() {
  require('../src/components/account/stories');
  require('../src/components/dialog/stories');
  require('../src/components/formattedNumber/stories');
  require('../src/components/toaster/stories');
}

configure(loadStories, module);
