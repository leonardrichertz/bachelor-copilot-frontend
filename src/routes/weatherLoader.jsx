import { redirect } from "react-router-dom";

export const weatherLoader = () => {
  console.log("Loader executed");
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    return redirect("/");
  }
  return null;
};
