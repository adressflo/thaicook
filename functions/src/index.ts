import {
  beforeUserCreated,
  beforeUserSignedIn,
} from "firebase-functions/v2/identity";

export const setSupabaseRoleOnSignUp = beforeUserCreated(() => {
  return {
    customClaims: {
      role: "authenticated",
    },
  };
});

export const addSupabaseRoleOnSignIn = beforeUserSignedIn(() => {
  return {
    customClaims: {
      role: "authenticated",
    },
  };
});
