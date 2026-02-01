import { LinkIcon } from '@heroicons/react/24/outline'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { z } from 'zod'
import { shortenUrl } from '../api'
import type { ShortenedLink } from '../types'
import { Button } from './button'
import { Spinner } from './spinner'

const formSchema = z.object({
  url: z.string().min(1, 'Please enter a URL').url('Please enter a valid URL'),
})

interface LinkFormProps {
  onSuccess: (link: ShortenedLink) => void
}

export function LinkForm({ onSuccess }: LinkFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      url: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)
      setIsLoading(true)
      try {
        const [result] = await Promise.all([
          shortenUrl(value.url),
          new Promise((resolve) => setTimeout(resolve, 300)),
        ])
        onSuccess(result)
        form.reset()
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <h2 className="text-3xl font-bold mb-4 font-serif">Get started</h2>
      <form.Field name="url">
        {(field) => (
          <>
            <label htmlFor="url" className="block text-base font-medium mb-2">
              Enter your long URL here
            </label>
            <div className="flex flex-col md:flex-row gap-2 md:gap-0">
              <div
                className={`border-2 flex items-stretch flex-1 transition-shadow focus-within:ring-2 focus-within:ring-primary ${
                  field.state.meta.errors.length > 0
                    ? 'border-negative focus-within:ring-negative'
                    : 'border-primary'
                }`}
              >
                <div
                  className={`border-r-2 flex items-center justify-center bg-background-intent aspect-square w-14 md:w-16 ${
                    field.state.meta.errors.length > 0 ? 'border-negative' : 'border-primary'
                  }`}
                >
                  <LinkIcon className="size-5" />
                </div>
                <input
                  type="url"
                  id="url"
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="https://example.com/your-long-url"
                  className="flex-1 px-4 py-3 md:py-0 text-lg transition-all placeholder:text-gray-400 focus:outline-none"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="large"
                  className="hidden md:flex rounded-none h-16 w-48"
                >
                  {isLoading ? <Spinner /> : 'Generate Short Link'}
                </Button>
              </div>
              <Button type="submit" size="large" className="md:hidden rounded-none h-14 w-full">
                {isLoading ? <Spinner /> : 'Generate Short Link'}
              </Button>
            </div>
            {field.state.meta.errors.length > 0 && (
              <p className="mt-3 text-sm text-negative">
                {field.state.meta.errors[0]?.message ?? String(field.state.meta.errors[0])}
              </p>
            )}
          </>
        )}
      </form.Field>

      {submitError && <p className="mt-3 text-sm text-negative">{submitError}</p>}
    </form>
  )
}
