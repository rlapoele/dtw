import type { ComponentProps } from "react";
import {
  SwatchIcon,
  ArrowsPointingOutIcon,
  ClockIcon,
  LinkIcon,
  LockClosedIcon,
  HashtagIcon,
  LanguageIcon,
  AdjustmentsHorizontalIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FolderIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  Square3Stack3DIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@presentation/lib/cn";

const icons = {
  swatch: SwatchIcon,
  dimension: ArrowsPointingOutIcon,
  clock: ClockIcon,
  link: LinkIcon,
  protected: LockClosedIcon,
  number: HashtagIcon,
  text: LanguageIcon,
  settings: AdjustmentsHorizontalIcon,
  undo: ArrowUturnLeftIcon,
  redo: ArrowUturnRightIcon,
  menu: Bars3Icon,
  "chevron-down": ChevronDownIcon,
  "chevron-left": ChevronLeftIcon,
  "chevron-right": ChevronRightIcon,
  folder: FolderIcon,
  info: InformationCircleIcon,
  search: MagnifyingGlassIcon,
  plus: PlusIcon,
  pencil: PencilIcon,
  stack: Square3Stack3DIcon,
  grid: Squares2X2Icon,
  close: XMarkIcon,
} as const;

export type IconName = keyof typeof icons;
export type IconProps = Omit<
  ComponentProps<typeof PlusIcon>,
  "name" | "className" | "aria-hidden" | "aria-label" | "role" | "focusable" | "children"
> & {
  name: IconName;
  className?: string;
  /** Omit for decoration; label only when the icon itself conveys meaning. */
  label?: string;
};

export function Icon({ name, className, label, ...props }: IconProps) {
  const Glyph = icons[name];
  return (
    <Glyph
      {...props}
      className={cn("size-4 shrink-0", className)}
      aria-hidden={label ? undefined : true}
      aria-label={label || undefined}
      role={label ? "img" : undefined}
      focusable="false"
    />
  );
}
