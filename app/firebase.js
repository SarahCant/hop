"use client";

import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  query,
  orderByChild,
  get,
  push,
  update,
  startAt,
  endAt,
  serverTimestamp,
} from "firebase/database";

//firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAEEQCXQjuWF2JMAXpJBxXSOqVlv5OCBww",
  authDomain: "hop25-4f4b5.firebaseapp.com",
  databaseURL:
    "https://hop25-4f4b5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hop25-4f4b5",
  storageBucket: "hop25-4f4b5.firebasestorage.app",
  messagingSenderId: "550491449235",
  appId: "1:550491449235:web:158b66a0272d4565e8aa66",
  measurementId: "G-NFM20JB5GX",
};

const app = initializeApp(firebaseConfig);

//auth
export const auth = getAuth(app);

//database
export const database = getDatabase(app);

//register w/ e-mail and password
export const register = async (email, username, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  //update displayName
  await updateProfile(user, { displayName: username });

  //save user in firebase realtime database
  await set(ref(database, `users/${user.uid}`), {
    uid: user.uid,
    username: username,
    email: user.email,
    createdAt: new Date().toISOString(),
    chats: {}, //for future chats
  });

  return user;
};

//login w/ e-mail and password
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

//logout
export const logout = () => {
  return auth.signOut();
};

//create new chat
export async function createGroupChat(currentUser, otherUsers, groupName) {
  console.log("createGroupChat with:", { currentUser, otherUsers });

  const chatRef = push(ref(database, "chats"));
  const chatId = chatRef.key;

  //create object w/ members
  const members = {};
  [currentUser, ...otherUsers].forEach((user) => {
    members[user.uid] = true;
  });

  //log after building members
  console.log("members:", members);

  //create chat object in {uid}/chats
  await set(chatRef, {
    name: groupName,
    members: members,
    createdAt: new Date().toISOString(),
    messages: {},
  });

  //update each {uid}/chats/{chatId}
  const updates = {};

  //log after building updates
  console.log("updates:", updates);

  //ref under each {uid}/chats/{chatId}
  Object.keys(members).forEach((uid) => {
    updates[`users/${uid}/chats/${chatId}`] = {
      name: groupName,
      createdAt: new Date().toISOString(),
    };
  });

  await update(ref(database), updates);

  return chatId;
}

//search users by e-mail
export async function searchUsersByEmailPrefix(prefix) {
  if (!prefix) return [];

  const usersRef = ref(database, "users");
  const q = query(
    usersRef,
    orderByChild("email"),
    startAt(prefix),
    endAt(prefix + "\uf8ff")
  );

  const snap = await get(q);
  if (!snap.exists()) return [];

  const data = snap.val();
  return Object.entries(data).map(([uid, user]) => ({
    uid,
    ...user,
  }));
}

//send message
export async function sendMessage(chatId, userId, text) {
  //set chat, user, and text
  console.log("sendMessage() in chatId:", chatId, "userId:", userId);

  const messagesRef = ref(database, `chats/${chatId}/messages`);

  //create new message location
  const newMsgRef = push(messagesRef);

  //write payload
  await set(newMsgRef, {
    sender: userId,
    text,
    timestamp: serverTimestamp(),
  });

  return newMsgRef.key;
}
