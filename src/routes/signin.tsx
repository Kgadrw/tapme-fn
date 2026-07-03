import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useAuth } from "@/context/auth-context";
import { noIndexHead } from "@/lib/seo";

export const Route = createFileRoute("/signin")({
  head: () => noIndexHead("Sign in"),
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
