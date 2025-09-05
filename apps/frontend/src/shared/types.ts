import { type LucideIcon } from "lucide-react";

import type { FileRouteTypes } from "~/routeTree.gen";

export type NavigationLink = {
  title: string;
  to: FileRouteTypes["to"];
  icon?: LucideIcon;
};

export type NavigationSubmenu = {
  title: string;
  icon?: LucideIcon;
  sub: Array<Navigation>;
};

export type Navigation = NavigationLink | NavigationSubmenu;
export type UniqueIdentifier = string | number;
