import React from 'react'
import { useForm } from '@/lib/hooks/use-form'
import { useStore } from '../store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const validate = {
  companyName: (value) => {
    if (!value || value.trim() === '') {
      return 'Company name is required'
    }
    return null
  }
}

export function Settings() {
  const { toast } = useToast()
  const settings = useStore(state => state.settings)
  const updateSettings = useStore(state => state.updateSettings)

  const form = useForm({
    initialValues: settings,
    validate
  })

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        form.setFieldValue('logo', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.validate()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive"
      })
      return
    }

    try {
      await updateSettings(form.values)
      toast({
        title: "Settings Updated",
        description: "Your company settings have been saved successfully."
      })

      // Debug info
      console.log('Updated Settings:', {
        stored: useStore.getState().settings,
        formValues: form.values
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Debug current state
  React.useEffect(() => {
    console.log('Current Settings State:', {
      storeSettings: settings,
      formValues: form.values,
      formErrors: form.errors,
      formTouched: form.touched
    })
  }, [settings, form.values, form.errors, form.touched])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Company Settings</CardTitle>
        <CardDescription>
          Manage your company information and invoice settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Company Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              {...form.getInputProps('companyName')}
              placeholder="Enter company name"
              className={form.errors.companyName ? 'border-red-500' : ''}
            />
            {form.errors.companyName && (
              <p className="text-sm text-red-500">{form.errors.companyName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Company Logo</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="cursor-pointer"
            />
            {settings.logo && (
              <div className="mt-2">
                <img 
                  src={settings.logo} 
                  alt="Company Logo" 
                  className="max-h-20 object-contain"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input
              {...form.getInputProps('address')}
              placeholder="Enter company address"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Invoice Number Prefix</label>
            <Input
              {...form.getInputProps('invoicePrefix')}
              placeholder="e.g., INV-"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={form.reset}
            >
              Reset
            </Button>
            <Button type="submit">
              Save Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
