// src/app/core/helpers/validators.ts
export const ValidatorsPatterns = {
  nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
  curp: /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]{2}$/,
  rfc: /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  telefono: /^[0-9]{10}$/,
  codigoPostal: /^[0-9]{5}$/,
  calle: /^[a-zA-Z0-9\s#.,-]{2,100}$/,
  numero: /^[0-9]{1,5}$/,
  colonia: /^[a-zA-Z0-9\s]{2,100}$/,
  estado: /^[a-zA-Z\s]{2,50}$/,
};
