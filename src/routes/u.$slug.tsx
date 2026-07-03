import { createFileRoute, redirect } from "@tanstack/react-router";

import { getProfileUrl } from "@/lib/domains";

export const Route = createFileRoute("/u/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ href: getProfileUrl(params.slug), replace: true });
  },
});
