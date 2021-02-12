import http from "./rasa";

export async function chat(sender, message) {
  return http.post("", {
    sender,
    message,
  });
}
