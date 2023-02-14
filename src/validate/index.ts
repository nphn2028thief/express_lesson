export const validateEmail = (email: string) => {
  const emailRegex: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  if (!email || !emailRegex.test(email)) {
    return false;
  }

  return true;
};
