import { LockClosedIcon, LinkIcon, ClockIcon, SwatchIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { Icon as SharedIcon, type IconProps } from '@presentation/ui/icon';
const extensions = {lock:LockClosedIcon,link:LinkIcon,clock:ClockIcon,swatch:SwatchIcon,measure:ArrowsRightLeftIcon};
/** Prototype-only extensions keep production Icon and its callers untouched. */
export function Icon(props: Omit<IconProps, 'name'> & {name: IconProps['name'] | keyof typeof extensions}) {
  const Glyph = extensions[props.name as keyof typeof extensions];
  if (!Glyph) return <SharedIcon {...props as IconProps}/>;
  return <Glyph className={props.className ?? 'size-4 shrink-0'} aria-hidden={props.label?undefined:true} role={props.label?'img':undefined} aria-label={props.label}/>;
}
