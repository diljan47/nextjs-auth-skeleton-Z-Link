"use server"
import { cookies } from "next/headers"
import { googleOAuthClient } from "../utils/googleOauth"
import { generateCodeVerifier, generateState } from "arctic"

export const getGoogleOauthConsentUrl = async () => {
    try {
        const state = generateState()
        const codeVerifier = generateCodeVerifier()
        const cookiesStore = await cookies();

        cookiesStore.set('google_code_verifier', codeVerifier, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        })
        cookiesStore.set('google_state', state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        })

        const authUrl = await googleOAuthClient.createAuthorizationURL(state, codeVerifier, ['openid', 'email', 'profile'])
        return { success: true, url: authUrl.toString() }

    } catch (error) {
        return { success: false, error: 'Something went wrong' }
    }
}   