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
  equalTo,
  get,
  push,
  update,
  startAt,
  endAt,
  serverTimestamp,
} from "firebase/database";

//firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  databaseURL: process.env.NEXT_PUBLIC_databaseURL,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket: process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_appId,
  measurementId: process.env.NEXT_PUBLIC_measurementId,
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
