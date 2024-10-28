import { sql } from "@vercel/postgres";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

declare module "next-auth" {
    interface Session {
      id: string;
      role: string;
    }
  
    interface User {
      id: string;
      role: string;
    }
  }
  
  declare module "next-auth/jwt" {
    interface JWT {
      id: string;
      role: string;
    }
  }
  

const handler = NextAuth({
    session: {
        strategy: 'jwt'
    },
    providers: [CredentialsProvider({
        credentials: {
          rut: {},
          pass: {}
        },
        async authorize(credentials) {
            console.log({credentials})
            const user = await sql`SELECT * FROM usuario WHERE rut_usuario = ${credentials?.rut} AND contraseña = ${credentials?.pass}`;
            if(user.rows.length > 0 && user.rows[0].rut_usuario == credentials?.rut && user.rows[0].contraseña == credentials?.pass){
                console.log("credentials correct");
                return{ id: credentials?.rut || "", password: null, role: user.rows[0].tipo };
            }
            console.log("credential failed");
            return null
        }
    })
    ],callbacks: {
        async session({ session, token }) {
          if (token) {
            session.role = token.role;
        }
        console.log("session es:", session);
        return session;
        },
        async jwt({ token, user }) {
          if (user) token.role = user.role;
          console.log("token es:", token);
          return token;
        },
      }, 
});

export {handler as GET, handler as POST};