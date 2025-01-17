/*
    Rai Website, a powerful tools, fun!
    ©2024 Rai and UpLauncher.

    Description: Rai module for the Rai Website.
*/

import { UserDataInterface } from "./raiChatTypes";

export function getURL() {
  return window.location.href;
}

export function getDomain() {
  return window.location.hostname;
}

export function getProtocol() {
  return window.location.protocol;
}

export function getPort() {
  return window.location.port;
}

export function getPath() {
  return window.location.pathname;
}

export function getHash() {
  return window.location.hash;
}

export function getSearch() {
  return window.location.search;
}

export function getOrigin() {
  return window.location.origin;
}

export function getHostname() {
  return window.location.hostname;
}

export function getVersion() {
  return "0.1-beta";
}

export function getUserId() {
  return window.localStorage.getItem("userId");
}

export function getPlan(planId: string) {
  if (planId.includes("pro_")) {
    return "pro";
  } else if (planId.includes("premiumPlus_")) {
    return "premiumplus";
  } else if (planId.includes("premium_")) {
    return "premium";
  } else {
    return "free";
  }
}

export function isCheckmarker(userData: UserDataInterface) {
  const result =
    userData.paid != "free" &&
    userData.verified == true &&
    userData.checkmarkState === false;
  return result;
}

export function xssProtectedText(text: string) {
  text = text.replace(/&/g, "&amp;");
  text = text.replace(/"/g, "&quot;");
  text = text.replace(/'/g, "&#x27;");
  text = text.replace(/</g, "&lt;");
  text = text.replace(/>/g, "&gt;");

  return text;
}