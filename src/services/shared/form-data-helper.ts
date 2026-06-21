import type { FormEvent } from "react";

export function getFormDataFromEvent(event: FormEvent) {
  const formData = new FormData(event.target as HTMLFormElement);
  return Object.fromEntries(formData.entries());
}
