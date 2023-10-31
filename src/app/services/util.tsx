export const AuthHeader = (token: string): object => {
  return { headers: { Authorization: token } };
};
