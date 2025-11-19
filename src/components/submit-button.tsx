// submit button with loading state
"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Button> & {
  children: React.ReactNode;
};

// button that shows spinner when form is submitting
export function SubmitButton({ children, ...props }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : children}
    </Button>
  );
}
