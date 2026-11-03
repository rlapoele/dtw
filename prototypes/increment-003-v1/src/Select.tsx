import type { ComponentProps } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
// Keep native select semantics and keyboard behavior; the outline icon is decorative.
export function Select(props:ComponentProps<'select'>){
 return <span className="select-control"><select {...props}/><ChevronDownIcon className="icon select-chevron" aria-hidden="true"/></span>;
}
