import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./custom-ui/common/ModeToggle";

export function SiteHeader() {
  return (
    <main className=" bg-white  dark:bg-black group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex w-[70%] items-center gap-1  lg:gap-2 ">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          {/* <h1 className="text-base font-medium">Documents</h1> */}
        </div>
        <ModeToggle />
      </div>
    </main>
  );
}
