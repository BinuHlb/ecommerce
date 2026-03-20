import Medusa from "@medusajs/medusa-js";

const MEDUSA_BACKEND_URL = window.location.origin;

export const medusa = new Medusa({ 
  baseUrl: MEDUSA_BACKEND_URL, 
  maxRetries: 3 
});
