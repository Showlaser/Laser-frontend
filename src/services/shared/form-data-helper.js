export function getFormDataFromEvent(event) {
  const formData = new FormData(event.target);
  return Object.fromEntries(formData.entries());
}
