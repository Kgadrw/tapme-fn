import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { useAuth } from "@/context/auth-context";

export const Route = createFileRoute("/register")({
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
