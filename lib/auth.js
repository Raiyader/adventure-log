import { hash, compare } from "bcrypt";

export async function hashPassword(password) {
  const hashedPw = hash(password, 12);
  return hashedPw;
}

export async function verifyPassword(password, hashedPw) {
  const isValid = await compare(password, hashedPw);
  return isValid;
}
