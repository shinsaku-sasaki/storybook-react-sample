import type { Meta, StoryObj } from '@storybook/react';

import InboxScreen from './InboxScreen';
import { Provider } from 'react-redux';
import store from '../lib/store';
import { http, HttpResponse, delay } from 'msw';
import { MockedState } from './TaskList.stories';

const meta = {
  component: InboxScreen,
  title: 'InboxScreen',
  tags: ['autodocs'],
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
} satisfies Meta<typeof InboxScreen>;


export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', async () => {
          await delay(800);
          return HttpResponse.json(MockedState.tasks);
        }),
      ],
    },
  },
};

export const Error: Story = {
  args: {
    error: true,
  },
  parameters: {
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', async () => {
          await delay(800);
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  },
};