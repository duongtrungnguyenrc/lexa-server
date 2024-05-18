import { google } from "googleapis";

export const GoogleAuthProvider = {
    provide: "GOOGLE_AUTH",
    useFactory: () => {
        return new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_AUTH_RETURN,
        );
    },
};
