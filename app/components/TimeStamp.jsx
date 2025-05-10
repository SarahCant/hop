import { useEffect, useState } from "react";
import Link from "next/link";
import {
  get,
  ref,
  query,
  limitToLast,
  child,
} from "firebase/database";
import { database } from "../firebase";
import UserIcon from "./UserIcon";