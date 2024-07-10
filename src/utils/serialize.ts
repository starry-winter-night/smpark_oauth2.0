const authSerialize = (
  data: { [key: string]: string; password: string },
  keysToRemove: string[],
): { [key: string]: string } => {
  const rest = { ...data };
  keysToRemove.forEach((key) => {
    delete rest[key];
  });
  return rest;
};

export { authSerialize };
