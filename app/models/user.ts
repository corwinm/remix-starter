import { Prisma } from "@prisma/client";
import { authenticator } from "~/utils/authenticator.server";
import { prismaClient } from "~/utils/prisma.server";
import { hash } from "../utils/bcrypt.server";
import { transporter } from "../utils/nodemailer.server";

export type User = {
  lastName?: string;
  firstName?: string;
  email: string;
  confirmed: boolean;
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
  host,
}: {
  email: string;
  password: string;
  host: string;
}) {
  const passwordHash = await hash(password);
  let confirmationCode = "";
  try {
    const prismaUser = await prismaClient.user.create({
      data: {
        email,
        passwordHash,
      },
    });
    const prismaCode = await prismaClient.conformationCode.create({
      data: {
        userId: prismaUser.id,
      },
    });
    confirmationCode = prismaCode.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code as string) {
        case "P2002":
          throw new EmailAlreadyUsedError("This email is already used.");
        default:
          throw Error("Unknown error occurred.");
      }
    }
  }
  try {
    // send mail with defined transport object
    await transporter.sendMail({
      from: '"No Reply" <no-reply@example.com>', // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world", // plain text body
      html: `
      <h1>Hello world</h1>
      <a href="${host}/confirmation?code=${confirmationCode}">Confirm Email</a>
    `, // html body
    });
  } catch (error) {
    console.error({ unknownError: error });
    if (error instanceof Error) {
      throw new Error("Email failed to send.");
    }
    throw Error("Unknown error occurred.");
  }
}

export async function confirmUser({ code }: { code: string }) {
  try {
    await prismaClient.conformationCode.update({
      where: {
        id: code,
      },
      data: {
        user: {
          update: {
            confirmed: true,
          },
        },
      },
    });
    await prismaClient.conformationCode.delete({ where: { id: code } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log({ error });
      switch (error.code as string) {
        case "P2016":
          // Code doesn't exist (or is already used)
          throw new Error("Unable to confirm email.");
        default:
          throw Error("Unknown error occurred.");
      }
    }
  }
}

export async function getUser({ request }: { request: Request }) {
  let user = await authenticator.isAuthenticated(request);
  return user;
}
