import { Alert } from "react-native";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.acodingduck.aora",
  projectId: "66e2a48f003d4ea2d917",
  databaseId: "66e2a638000dbe18f5d3",
  userCollectionId: "66e2a651000904be5bb4",
  videoCollectionId: "66e2a66a002b3bedab4e",
  storageId: "66e2a78700048b6b05a5",
  bookmarkCollectionId: "66e5609d0031543689e1",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

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
      config.databaseId,
      config.userCollectionId,
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
};

export const getCurrentUser = async () => {
  try {
    const currentAccont = await account.get();
    if (!currentAccont) {
      throw new Error("Failed to get current account");
    }
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
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

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt")]
    );
    console.log(posts.documents[0].$id);
    return posts.documents;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt", Query.limit(7))]
    );

    return posts.documents;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid type");
    }

    if (!fileUrl) {
      throw new Error("Invalid file type");
    }

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadFile = async (file, type) => {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        prompt: form.prompt,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        creator: form.userId,
      }
    );
    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};

export const createBookmark = async (userId, videoId) => {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.bookmarkCollectionId,
      [Query.equal("user_id", userId), Query.equal("video_id", videoId)]
    );

    if (response.documents.length) {
      Alert.alert("Already bookmarked");
      return;
    }

    await databases.createDocument(
      config.databaseId,
      config.bookmarkCollectionId,
      ID.unique(),
      {
        user_id: userId,
        video_id: videoId,
      }
    );
    Alert.alert("Bookmark created");
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteBookmark = async (userId, videoId) => {
  try {
    const bookmarks = await databases.listDocuments(
      config.databaseId,
      config.bookmarkCollectionId,
      [Query.equal("user_id", userId), Query.equal("videoId", videoId)]
    );

    if (!bookmarks.documents.length) {
      throw new Error("Bookmark not found");
    }

    await databases.deleteDocument(
      config.databaseId,
      config.bookmarkCollectionId,
      bookmarks.documents[0].$id
    );
    console.log("Bookmark deleted");
    Alert.alert("Bookmark deleted");
  } catch (error) {
    throw new Error(error);
  }
};

export const getBookmarkedVideos = async (userId) => {
  try {
    const bookmarks = await databases.listDocuments(
      config.databaseId,
      config.bookmarkCollectionId,
      [Query.equal("user_id", userId), Query.orderDesc("$createdAt")]
    );

    const videoIds = bookmarks.documents.map((bookmark) => bookmark.video_id);

    const videos = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("$id", videoIds)]
    );

    return videos.documents;
  } catch (error) {
    console.log("Error fetching bookmarked videos", error);
    return [];
  }
};
