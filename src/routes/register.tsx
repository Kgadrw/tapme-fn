import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useAuth } from "@/context/auth-context";
import { noIndexHead } from "@/lib/seo";

export const Route = createFileRoute("/register")({
  head: () => noIndexHead("Register"),
  component: RegisterRedirect,
});

function RegisterRedirect() {
  const navigate = useNavigate();
  const { openRegister } = useAuth();

  useEffect(() => {
    openRegister();
    navigate({ to: "/", replace: true });
  }, [navigate, openRegister]);

  return null;
}
