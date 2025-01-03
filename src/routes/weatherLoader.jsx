import { redirect } from "react-router-dom";

export const weatherLoader = () => {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    return redirect("/");
  }
  return null;
};
