import React from 'react'
import { useForm } from '@mantine/form'
import { TextInput, Button, Stack } from '@mantine/core'

export function ClientForm({ onSubmit, initialValues }) {
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      address: '',
      phone: '',
      ...initialValues
    },
    validate: {
      name: (value) => !value ? 'Name is required' : null,
      email: (value) => !/^\S+@\S+$/.test(value) ? 'Invalid email' : null
    }
  })

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <TextInput
          label="Name"
          required
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Email"
          required
          {...form.getInputProps('email')}
        />
        <TextInput
          label="Address"
          {...form.getInputProps('address')}
        />
        <TextInput
          label="Phone"
          {...form.getInputProps('phone')}
        />
        <Button type="submit">Save Client</Button>
      </Stack>
    </form>
  )
}
