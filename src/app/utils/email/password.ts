"use server";
import argon2 from "argon2";

export const hashPassword = async (password: string) => {
  const hash = await argon2.hash(password);
  return hash;
};

export const verifyPasswordHash = async (
  hashedPassword: string,
  password: string
) => {
  return await argon2.verify(hashedPassword, password);
};