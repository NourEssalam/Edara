import { ThemeProvider } from "@/components/providers/theme-provider";
import { AppSidebar } from "@/components/app-sidebar";
// import { ChartAreaInteractive } from "@/components/chart-area-interactive";
// import { DataTable } from "@/components/data-table";
// import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
// import { BACKEND_URL } from "@/lib/constants";
// import GetOut from "@/components/custom-ui/getOut";
// import data from "./data.json";
// export const dynamic = "force-dynamic";
export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {/* <Header /> */}
        <SidebarProvider>
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {/* <SectionCards />
                    <div className="px-4 lg:px-6">
                      <ChartAreaInteractive />
                    </div>
                    <DataTable data={data} /> */}

                  {children}
                </div>
              </div>
            </div>
            {/* <div>{children}</div> */}
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </>
  );
}
