import { Prisma } from "@prisma/client";
import { prismaClient } from "~/utils/prisma.server";
import { hash } from "../utils/bcrypt.server";

export type User = {
  lastName?: string;
  firstName?: string;
  email: string;
};

export async function findUserByEmail(email: string) {
  return await prismaClient.user.findUniqueOrThrow({
    where: {
      email,
    },
  });
}

export class EmailAlreadyUsedError extends Error {}

export async function registerUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const passwordHash = await hash(password);
  try {
    return await prismaClient.user.create({
      data: {
        email,
        passwordHash,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code as string) {
        case "P2002":
          throw new EmailAlreadyUsedError("This email is already used.");
        default:
        // no default
      }
    }
  }
  throw Error("Unknown error occurred.");
}
