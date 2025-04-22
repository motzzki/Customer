const useProduction = true;

export const API_BASE_URL = useProduction
  ? "https://csm.sdocabuyao.com/api"
  : "http://localhost:5000/api";
