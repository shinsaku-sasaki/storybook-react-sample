import type { Meta, StoryObj } from '@storybook/react';

import InboxScreen from './InboxScreen';
import { Provider } from 'react-redux';
import store from '../lib/store';

const meta = {
  component: InboxScreen,
  title: 'InboxScreen',
  tags: ['autodocs'],
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
} satisfies Meta<typeof InboxScreen>;


export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};

export const Error: Story = {
  args: {
    error: true,
  }
};