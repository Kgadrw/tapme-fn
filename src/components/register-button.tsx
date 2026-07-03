import type { ReactNode } from "react";

import { useAuth } from "@/context/auth-context";

type RegisterButtonProps = {
  className?: string;
  children: ReactNode;
};

export function RegisterButton({ className, children }: RegisterButtonProps) {
  const { openRegister } = useAuth();

  return (
    <button type="button" onClick={openRegister} className={className}>
      {children}
    </button>
  );
}
