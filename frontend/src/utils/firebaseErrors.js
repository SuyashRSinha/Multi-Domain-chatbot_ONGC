export function getFirebaseErrorMessage(code) {

    switch (code) {

        case "auth/email-already-in-use":
            return "An account with this email already exists.";

        case "auth/invalid-email":
            return "Please enter a valid email address.";

        case "auth/user-not-found":
            return "No account found with this email.";

        case "auth/wrong-password":
            return "Incorrect email or password.";

        case "auth/invalid-credential":
            return "Incorrect email or password.";

        case "auth/weak-password":
            return "Password must be at least 6 characters long.";

        case "auth/network-request-failed":
            return "Unable to connect. Please check your internet connection.";

        case "auth/too-many-requests":
            return "Too many failed attempts. Please try again later.";

        case "auth/user-disabled":
            return "This account has been disabled.";

        default:
            return "Something went wrong. Please try again.";
    }

}