import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDatabase, ref, set, query, orderByChild, equalTo, get, push, update, startAt, endAt, onValue, off, push as fbPush, serverTimestamp} from "firebase/database";

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

export const auth = getAuth(app);
export const database = getDatabase(app);

//register
export const register = async (email, username, password) => {
 /*  const response = await createUserWithEmailAndPassword(auth, email, password);
    return await updateProfile(response.user, { displayName: username }); */
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
  
    //update displayName
    await updateProfile(user, { displayName: username });
  
    //save user in Realtime Database
    await set(ref(database, `users/${user.uid}`), {
      uid: user.uid,
      username: username,
      email: user.email,
      createdAt: new Date().toISOString(),
      chats: {}, //for future chats
    });
  
    return user;
};

//login w/ email and password
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

//logout
export const logout = () => {
  return auth.signOut();
};

//find user by email
export async function findUserByEmail(email) {
  const usersRef = ref(database, 'users');
  const q = query(usersRef, orderByChild('email'), equalTo(email));

  const snapshot = await get(q);

  if (snapshot.exists()) {
    const users = snapshot.val();
    const userList = Object.keys(users).map((key) => ({
      uid: key,
      ...users[key]
    }));
    return userList[0];
  } else {
    return null;
  }
}

//create new chat
  export async function createGroupChat(currentUser, otherUsers, groupName) {
    console.log("createGroupChat with:", { currentUser, otherUsers });



    const chatRef = push(ref(database, 'chats'));
    const chatId = chatRef.key;
  
    // Correctly create a members object
    const members = {};
    [currentUser, ...otherUsers].forEach((user) => {
      members[user.uid] = true;
    });

    // after building members:
console.log("members:", members);
  
    // Create chat object in {uid}/chats
    await set(chatRef, {
      name: groupName,
      members: members,
      createdAt: new Date().toISOString(),
      messages: {}
    });

    //update each {uid}/chats/{chatId}
    const updates = {};

      // after building updates:
console.log("updates:", updates);
  
    //ref under each {uid}/chats/{chatId}
    Object.keys(members).forEach((uid) => {
      updates[`users/${uid}/chats/${chatId}`] = {
        name: groupName,
        createdAt: new Date().toISOString()
      };
    });
  
    await update(ref(database), updates);
  
    return chatId;
  };

  //live-search users by email
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
      ...user
    }));
  };
  

  //send message
  export async function sendMessage(chatId, userId, text) { //set chat, user, and text
    console.log("sendMessage() in chatId:", chatId, "userId:", userId);

    const messagesRef =ref(database, `chats/${chatId}/messages`);
   
    //create a new msg location
    const newMsgRef = push(messagesRef);
    //then write the payload
    await set(newMsgRef, {
      sender: userId,
      text,
      timestamp: serverTimestamp(),
    });

  return newMsgRef.key;
}
   /*  const newMsgRef = await push(messagesRef, {
      sender: userId,
      text,
      timestamp: serverTimestamp(), //add timestamp to e.g. sort with later on
    });
    return newMsgRef.key;
  }
 */