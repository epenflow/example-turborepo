import { User } from "lucide-react";

import type { Navigation } from "~/shared/types";

export const DASHBOARD_SIDEBAR: Navigation[] = [
  {
    title: "User",
    to: "/users",
    icon: User,
  },
];
