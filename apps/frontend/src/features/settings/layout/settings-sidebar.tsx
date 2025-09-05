import { Link } from "@tanstack/react-router";

import { SETTINGS_SIDEBAR } from "../constant";
import { Button } from "~/components/ui";

export function SettingsSidebar() {
  return (
    <aside className="w-full max-w-xl lg:w-48">
      <nav className="flex flex-col space-y-1 space-x-0 [&_a]:data-[status=active]:bg-muted">
        {SETTINGS_SIDEBAR.map(
          (nav, key) =>
            "to" in nav && (
              <Button
                asChild
                key={key}
                size="sm"
                variant="ghost"
                className="w-full justify-start">
                <Link to={nav.to}>{nav.title}</Link>
              </Button>
            ),
        )}
      </nav>
    </aside>
  );
}
