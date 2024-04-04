import { DEBUG } from "@/config/app";
import NotFoundPage from "@/pages/404";
import InternalServerErrorPage from "@/pages/500";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
export const Route = createRootRoute({
  component: Page,
  errorComponent: InternalServerErrorPage,
  notFoundComponent: NotFoundPage,
});

function Page() {
  return (
    <>
      <Outlet />
      {DEBUG ? <TanStackRouterDevtools /> : null}
    </>
  );
}
