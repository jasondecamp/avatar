export const safeClass = (name) =>
  name.replace(/([^A-Za-z0-9]+)/g,'-').toLowerCase();
