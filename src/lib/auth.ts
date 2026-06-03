import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Hardcoded Super Admin check
        if (credentials.email === "algazzar" && credentials.password === "mooha2711") {
          return {
            id: "admin-1",
            name: "Super Admin",
            email: "admin@perfumeex.com",
            role: "SUPER_ADMIN"
          };
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user?.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        // Fetch company data if COMPANY_OWNER
        let companyData = null;
        if (user.role === "COMPANY_OWNER") {
          const company = await prisma.company.findUnique({
            where: { userId: user.id },
            select: { slug: true, nameAr: true }
          });
          if (company) {
            companyData = company;
          }
        }

        return {
          ...user,
          companySlug: companyData?.slug,
          companyName: companyData?.nameAr
        };
      }
    })
  ],
  pages: {
    signIn: "/en/login",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET || "supersecret123",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        
        if ((user as any).companySlug) {
          token.companySlug = (user as any).companySlug;
          token.companyName = (user as any).companyName;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        if (token.companySlug) {
          (session.user as any).companySlug = token.companySlug;
          (session.user as any).companyName = token.companyName;
        }
      }
      return session;
    }
  }
};
