import type { Meta, StoryObj } from '@storybook/react';

import InboxScreen from './InboxScreen';
import { Provider } from 'react-redux';
import store from '../lib/store';
import { http, HttpResponse, delay } from 'msw';
import { MockedState } from './TaskList.stories';
import { userEvent, waitFor, waitForElementToBeRemoved, within } from '@storybook/test';

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Waits for the component to transition from the loading state
    await waitForElementToBeRemoved(await canvas.findByTestId('loading'));
    // Waits for the component to be updated based on the store
    await waitFor(async () => {
      // Simulates pinning the first task
      await userEvent.click(canvas.getByLabelText('pinTask-1'));
      // Simulates pinning the third task
      await userEvent.click(canvas.getByLabelText('pinTask-3'));
    });
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