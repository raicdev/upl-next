import { User } from "firebase/auth";

export interface UserDataInterface {
  paid: string;
  bio: string | null;
  image: string | null;
  verified: boolean;
  checkmarkState: boolean;
  isStaff: boolean;
  isStudent: boolean;
  username: string;
  uid: string;
  banned: boolean;
  banReason?: string;
  followers: number;
  isGov: boolean;
  handle?: string;
  highlightActive: boolean;
}

export interface MessageDataInterface {
  username: string;
  replyTo?: number;
  message: string;
  paid: string;
  uid: string;
  edited: boolean;
  time: string;
  id: number | string;
  favorite: number;
  isSystemMessage: boolean;
}

export interface MessageElementDataInterface {
  userData: UserDataInterface;
  messageData: MessageDataInterface;
  user: User;
  userSettings: any;
}

export interface SubscriptionDataInterface {
  expiryDate: number;
  lastChecked: number;
  isExpired: boolean;
  id: string;
  plan: string;
  isStudent: boolean;
  isStaff: boolean;
}

export function toBoolean(booleanStr: string): boolean {
  return booleanStr.toLowerCase() === "true";
}

export function returnSettingsJson() {
  const settings = {
    available: true,
    hide_checkmark: false,
    highlight: false,
    edit: false,
    version: "1.0",
    markdown: true,
  };
  // if (window.localStorage.getItem("raichat-settings-version") !== "1.0") {
  //   window.localStorage.clear();
  //   window.localStorage.setItem("raichat-settings-available", "true");
  //   window.localStorage.setItem("raichat-hide-checkmark", "false");
  //   window.localStorage.setItem("raichat-highlight", "false");
  //   window.localStorage.setItem("raichat-settings-version", "1.0");
  //   window.localStorage.setItem("raichat-markdown", "true");
  //   window.sessionStorage.setItem("raichat-settings-reseted", "true");
  // }
  return settings;
}

function auto_link(val: string) {
  const exp =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  if (val.includes("[url]") || val.includes("img") || val.includes("video")) {
    return val;
  } else {
    return val.replace(exp, `<FaGlobe /><a target='_blank' href='$1'>$1</a>`);
  }
}