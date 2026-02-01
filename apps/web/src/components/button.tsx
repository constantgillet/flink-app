import {
  Button as RACButton,
  type ButtonProps as RACButtonProps,
  composeRenderProps,
} from 'react-aria-components'
import { tv } from 'tailwind-variants'
import { focusRing } from '../utils'

export interface ButtonProps extends RACButtonProps {
  /** @default 'primary' */
  variant?: 'primary' | 'outline'
  size?: 'small' | 'medium' | 'large'
}

const button = tv({
  extend: focusRing,
  base: 'relative inline-flex items-center justify-center gap-2 border border-transparent h-9 box-border cursor-pointer',
  variants: {
    variant: {
      primary: 'bg-primary hover:bg-primary/80 pressed:bg-primary/90 text-primary-foreground',
      outline: 'border border-primary hover:bg-primary/5 pressed:bg-primary/10 text-primary',
    },
    isDisabled: {
      true: 'border-transparent dark:border-transparent bg-neutral-100 dark:bg-neutral-800 text-neutral-300 dark:text-neutral-600 forced-colors:text-[GrayText]',
    },
    isPending: {
      true: 'text-transparent',
    },
    size: {
      small: 'text-sm px-2 py-1',
      medium: 'text-base px-4 py-2',
      large: 'text-base  px-4 py-5',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
  compoundVariants: [
    {
      variant: 'primary',
      isDisabled: true,
      class: 'bg-transparent dark:bg-transparent',
    },
  ],
})

export function Button(props: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        button({ ...renderProps, variant: props.variant, size: props.size, className }),
      )}
    >
      {composeRenderProps(props.children, (children) => (
        <>{children}</>
      ))}
    </RACButton>
  )
}
