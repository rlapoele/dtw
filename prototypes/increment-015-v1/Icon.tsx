import { ArrowUturnLeftIcon, ArrowUturnRightIcon, Bars3Icon, ChevronRightIcon, FolderIcon, MagnifyingGlassIcon, PlusIcon, Square3Stack3DIcon } from '@heroicons/react/24/outline';
const icons={undo:ArrowUturnLeftIcon,redo:ArrowUturnRightIcon,menu:Bars3Icon,chevron:ChevronRightIcon,folder:FolderIcon,search:MagnifyingGlassIcon,plus:PlusIcon,stack:Square3Stack3DIcon};
export function Icon({name,className=''}:{name:keyof typeof icons;className?:string}) {const Glyph=icons[name]; return <Glyph aria-hidden="true" focusable="false" className={`p15-icon ${className}`}/>;}
