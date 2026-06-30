const config = {
  apiUrl: import.meta.env.VITE_API_URL,
};

if (!config.apiUrl) {
  throw new Error("VITE_API_URL is missing in frontend .env");
}

export default config;
