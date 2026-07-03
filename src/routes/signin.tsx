import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useAuth } from "@/context/auth-context";

export const Route = createFileRoute("/signin")({
  component: SignInRedirect,
});

function SignInRedirect() {
  const navigate = useNavigate();
  const { openSignIn } = useAuth();

  useEffect(() => {
    openSignIn();
    navigate({ to: "/", replace: true });
  }, [navigate, openSignIn]);

  return null;
}
