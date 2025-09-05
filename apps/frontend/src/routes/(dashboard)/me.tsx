import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/me")({
  params: {},
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(dashboard)/me"!</div>;
}
