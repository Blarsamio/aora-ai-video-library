import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.acodingduck.aora",
  projectId: "66e2a48f003d4ea2d917",
  databaseId: "66e2a638000dbe18f5d3",
  userCollectionId: "66e2a651000904be5bb4",
  videoCollectionId: "66e2a66a002b3bedab4e",
  storageId: "66e2a78700048b6b05a5",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) {
      throw new Error("Failed to create account");
    }

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    if (!session) {
      throw new Error("Failed to sign in");
    }
    return session;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccont = await account.get();
    if (!currentAccont) {
      throw new Error("Failed to get current account");
    }
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccont.$id)]
    );
    if (!currentUser) {
      throw new Error("Failed to get current user");
    }
    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
