import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="inline-flex items-center gap-2">
      <Link to="/sign-up">Sign-Up</Link>
      <Link to="/me">Me</Link>
      <Link to="/sign-in">Sign-In</Link>
    </div>
  );
}
