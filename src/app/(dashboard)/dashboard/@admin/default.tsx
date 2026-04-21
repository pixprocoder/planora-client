// This file ensures that shared routes (like /dashboard/settings) 
// still render even when the admin slot doesn't have a specific page for them.
export default function AdminDefault() {
  return null;
}
