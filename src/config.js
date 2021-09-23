export default {
  API_URL:
    process.env.NODE_ENV === "production"
      ? "http://167.172.76.19:3001"
      : "http://127.0.0.1:3001",
  MAP_TOKEN:
    "pk.eyJ1IjoibW92ZXJzIiwiYSI6ImNrdDVnbXp5ZDA4NmcycXFzMWtuamxuODQifQ.DlegQcTzXkX0yGEIO45vDQ",
};
