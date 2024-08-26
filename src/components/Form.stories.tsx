import type { Meta, StoryObj } from '@storybook/react';

import { Form } from './Form';
import { fn } from '@storybook/test';

const meta = {
  component: Form,
  title: 'Form',
  tags: ['autodocs'],
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "title",
    description: "description",
    submitLabel: "submitLabel",
  }
};

export const Sample: Story = {
  args: {
    title: "title2",
    description: "description2",
    submitLabel: "submitLabel2",
  }
};