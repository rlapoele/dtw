import { LockClosedIcon } from '@heroicons/react/24/outline';
import { Icon as SharedIcon, type IconProps } from '@presentation/ui/icon';
/** Prototype-only extension: keep production Icon and its callers untouched. */
export function Icon(props: Omit<IconProps, 'name'> & {name: IconProps['name'] | 'lock'}) {
  if (props.name !== 'lock') return <SharedIcon {...props as IconProps}/>;
  return <LockClosedIcon className={props.className ?? 'size-4 shrink-0'} aria-hidden="true"/>;
}
