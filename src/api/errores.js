export function parsearErrorApi(error) {
  const status = error.response?.status;
  const data = error.response?.data;

  if (!status) {
    return { tipo: 'red', mensaje: 'No se pudo conectar con el servidor.', detalle: null };
  }
  if (status === 400) {
    const campos = data && typeof data === 'object'
      ? Object.entries(data).map(([campo, msgs]) => `${campo}: ${[].concat(msgs).join(' ')}`)
      : [];
    return { tipo: 'validacion', mensaje: 'Revisa los datos del formulario.', detalle: campos };
  }
  if (status === 404) {
    return { tipo: 'no_encontrado', mensaje: 'El recurso no existe.', detalle: null };
  }
  return { tipo: 'desconocido', mensaje: 'Ocurrió un error inesperado.', detalle: null };
}