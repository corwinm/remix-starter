import bcrypt from "bcrypt";

const saltRounds = 10;

export const hash = async (value: string) => {
  return await bcrypt.hash(value, saltRounds);
};

export const compare = async (value: string, hashed: string) => {
  return await bcrypt.compare(value, hashed);
};
