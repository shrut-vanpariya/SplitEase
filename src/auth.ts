import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

import { connectMongoDB } from "@/dbConfig/dbConfig";
import User from "@/models/User";
import bcryptjs from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {},

            async authorize(credentials) {
                // console.log("cerdentials = ", credentials);

                const { email, password }: any = credentials;

                try {
                    await connectMongoDB();
                    const user = await User.findOne({ email });

                    if (!user) {
                        return null;
                    }

                    if (user.authProvider !== "credentials") {
                        return null;
                    }

                    const passwordsMatch = await bcryptjs.compare(password, user.password);

                    if (!user.isVerified) {
                        return null;
                    }
                    if (!passwordsMatch) {
                        return null;
                    }
                    console.log(user);
                    console.log("\n\n\n====================================================================\n\n\n");
                    // return user;
                    const authUser: any = { id: user._id, name: user.username, email: user.email, image: "" };
                    return authUser;
                } catch (error) {
                    console.log("Error: ", error);
                    return null;
                }
            },
        })
    ],
    callbacks: {
        async signIn({ user, account }: any) {

            if (account.provider === "google" || account.provider === 'github') {
                const { name, email, image } = user;
                console.log("=========== this is signIn Callback : =====\n", user);
                try {
                    await connectMongoDB();
                    const userExists = await User.findOne({ email });

                    if (!userExists) {

                        // TODO: remove static password from hashed password
                        //hash password
                        const salt = await bcryptjs.genSalt(10)
                        const hashedPassword = await bcryptjs.hash("s65t46df58e76dh45f6df", salt)

                        const newUser = new User({
                            username: name,
                            email,
                            // password: hashedPassword,
                            image,
                            isVerified: true,
                            authProvider: account.provider
                        })

                        const savedUser = await newUser.save()

                        user.id = savedUser._id;
                        user.name = savedUser.username

                        console.log(savedUser);

                    }
                    else {
                        user.id = userExists._id;
                        user.name = userExists.username
                    }

                } catch (error) {
                    console.log("=========== SignIn Callback error: =========== \n" ,error);
                    return null;
                }
            }
            console.log('final user = ', user);

            return user;
        },
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            // console.log(!!auth);

            return !!auth
        },
        async jwt({ token, account, profile }: any) {
            // console.log("jwt", token, account);
            // console.log("\n\n\n====================================================================\n\n\n");

            // Persist the OAuth access_token and or the user id to the token right after signin
            // if (account) {
            //     token.accessToken = account.access_token
            //     token.id = profile.id
            // }
            return token
        },
        async session({ session, token, user }: any) {
            // Send properties to the client, like an access_token and user id from a provider.
            // console.log("session: ", session, token, user);
            // console.log("\n\n\n====================================================================\n\n\n");

            // session.accessToken = token.accessToken
            // session.user.id = token.id

            return session
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 30 // 1 month
    },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/login",
    },
})