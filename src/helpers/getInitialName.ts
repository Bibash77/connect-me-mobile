export const getInitials = (name: string) => {
  const names = name.trim().split(/\s+/);
  if (names.length >= 2) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.trim().substring(0, 2).toUpperCase();
};
