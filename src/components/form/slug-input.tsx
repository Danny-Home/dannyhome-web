'use client'

import { useId, useRef, useEffect } from 'react'
import { withMask } from 'use-mask-input'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


const slugMask = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

const SlugInput = ({
  value,
  onChange,
  ...rest
}: React.ComponentProps<typeof Input>) => {
  const id = useId()
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      withMask('', { casing: 'lower' })(ref.current)
    }
  }, [])

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const slugified = slugMask(e.target.value)
    onChange?.({
      ...e,
      target: { ...e.target, value: slugified },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor={id}>Slug</Label>
      <Input
        {...rest}
        ref={ref}
        id={id}
        placeholder="my-product-slug"
        autoComplete="off"
        value={value}
        onChange={handleChange}
      />
    </div>
  )
}

export default SlugInput
