import { Outlet } from "@tanstack/react-router";

import { SettingsSidebar } from "./settings-sidebar";
import { Heading, Separator } from "~/components/ui";

export function SettingsLayout() {
  return (
    <div className="px-4 py-6">
      <Heading title="Settings" description="Manage your account settings" />

      <div className="flex flex-col lg:flex-row lg:space-x-12">
        <SettingsSidebar />
        <Separator className="my-6 lg:hidden" />

        <div className="flex-1 md:max-w-2xl">
          <section className="max-w-xl space-y-12">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}
