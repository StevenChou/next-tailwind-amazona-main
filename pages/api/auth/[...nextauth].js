import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcryptjs from 'bcryptjs'

import db from '../../../utils/db'

import User from '../../../models/User'

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      // user._id 來自於 DB，token 則存在於 NextAuth 中
      if (user?._id) token._id = user._id
      if (user?.isAdmin) token.isAdmin = user.isAdmin

      return token
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin

      return session
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect()

        const user = await User.findOne({
          email: credentials.email,
        })

        await db.disconnect()

        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          // return 的就是 callbacks: {async jwt({token, user})} 中的 user
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: 'f',
            isAdmin: user.isAdmin,
          }
        }

        throw new Error('Invalid email or password')
      },
    }),
  ],
})
