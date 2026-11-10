import { Tabs } from "@base-ui/react/tabs";
/** Shared inspection tab strip; Base UI retains roving focus and panel semantics. */
export function InspectionTabs() {
  return (
    <Tabs.List
      className="tabs flex border-b border-border px-6 gap-5.5 source-compact:px-5 source-compact:gap-4.5"
      aria-label="Token inspection"
    >
      <Tabs.Tab
        className="relative border-0 bg-transparent min-h-10.5 text-caption text-muted-foreground p-0 data-active:text-foreground data-active:font-semibold data-active:after:absolute data-active:after:h-1 data-active:after:-bottom-px data-active:after:inset-x-0 data-active:after:bg-primary"
        value="authored"
      >
        Authored value
      </Tabs.Tab>
      <Tabs.Tab
        className="relative border-0 bg-transparent min-h-10.5 text-caption text-muted-foreground p-0 data-active:text-foreground data-active:font-semibold data-active:after:absolute data-active:after:h-1 data-active:after:-bottom-px data-active:after:inset-x-0 data-active:after:bg-primary"
        value="resolved"
      >
        Resolved &amp; trace
      </Tabs.Tab>
    </Tabs.List>
  );
}
