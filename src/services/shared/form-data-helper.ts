export function getFormDataFromEvent(event: any) {
  const formData = new FormData(event.target);
  return Object.fromEntries(formData.entries());
}
