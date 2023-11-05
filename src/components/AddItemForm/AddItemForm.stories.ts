import type {Meta, StoryObj} from '@storybook/react';
import AddItemForm from "./AddItemForm";


const meta: Meta<typeof AddItemForm> = {
    title: 'TODOLISTS/AddItemForm',
    component: AddItemForm,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
    argTypes: {
        addItem: {
            action: 'clicked',
            description: 'Button clicked inside form'
        }
    }
}

type Story = StoryObj<typeof AddItemForm>

export const AddItemFormStory: Story = {
    args: {
        label: 'Add item',
        fullWidth: true
    }
}

export default meta;