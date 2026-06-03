import NextAuth, {
  NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export const authOptions: NextAuthOptions =
  {
    providers: [
      CredentialsProvider({
        name: "Credentials",

        credentials: {
          email: {
            label: "Email",
            type: "email",
          },

          password: {
            label: "Senha",
            type: "password",
          },
        },

        async authorize(credentials: any) {
          try {
            await connectDB();

            const rawEmail =
              (credentials?.email as string) ||
              (credentials?.username as string) ||
              "";
            const email = rawEmail.toLowerCase().trim();
            const password =
              credentials?.password as string;

            if (!email || !password) {
              console.error("Credentials incompletas", {
                email: rawEmail,
              });
              return null;
            }

            const user =
              await User.findOne({
                email,
              });

            if (!user) {
              console.error("Usuário não encontrado", { email });
              return null;
            }

            const isValidPassword =
              await bcrypt.compare(
                password,
                user.password
              );

            if (!isValidPassword) {
              console.error("Senha inválida", { email });
              return null;
            }

            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
            };
          } catch (error) {
            console.error(error);
            return null;
          }
        },
      }),
    ],

    session: {
      strategy: "jwt",
    },

    pages: {
      signIn: "/auth/signin",
    },

    callbacks: {
      async jwt({
        token,
        user,
      }: {
        token: any;
        user: any;
      }) {
        if (user) {
          token.id = user.id;
          token.role = user.role;
        }

        return token;
      },

      async session({
        session,
        token,
      }: {
        session: any;
        token: any;
      }) {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.role = token.role as string;
        }

        return session;
      },
    },

    secret:
      process.env.NEXTAUTH_SECRET,
  };

const handler =
  NextAuth(authOptions);

export {
  handler as GET,
  handler as POST,
};