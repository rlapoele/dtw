import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
// Adapted from shadcn/ui (MIT), checked 2026-11-03:
// https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/base/ui/button.tsx
// Kept Base UI primitive/props, variant composition and data-slot; trimmed unused
// variants/sizes, expanded theme classes, and joined className without a cn alias.
const buttonVariants = cva(
 'group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-colors select-none disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
 {variants:{variant:{
 default:'bg-primary text-primary-foreground border border-primary hover:bg-primary/90',
 outline:'border border-border bg-background text-foreground hover:bg-muted',
 ghost:'border border-transparent bg-transparent text-foreground hover:bg-muted',
 },size:{default:'h-8 px-3',sm:'h-7 px-2'}},defaultVariants:{variant:'default',size:'default'}}
);
function Button({ className, variant='outline', size='default', ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>){
 return <ButtonPrimitive data-slot="button" className={buttonVariants({variant,size,className:typeof className==='string'?`button ${className}`:'button'})} {...props}/>;
}
export {Button,buttonVariants};
