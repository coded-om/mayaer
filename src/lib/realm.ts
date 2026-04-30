import * as Realm from "realm-web";

const appId = import.meta.env.VITE_REALM_APP_ID as string;

if (!appId || appId === "your-atlas-app-id-here") {
  console.warn(
    "[Budget Buddy] VITE_REALM_APP_ID is not set. " +
      "Copy .env.example to .env.local and fill in your Atlas App ID.",
  );
}

export const realmApp = new Realm.App({ id: appId || "placeholder" });
export { Realm };
