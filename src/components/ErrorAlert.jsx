function ErrorAlert({ error }) {
  if (!error) return null;
  return (
    <div className="alerta alerta-error" role="alert">
      <p>{error.mensaje}</p>
      {Array.isArray(error.detalle) && error.detalle.length > 0 && (
        <ul>{error.detalle.map((linea) => <li key={linea}>{linea}</li>)}</ul>
      )}
    </div>
  );
}

export default ErrorAlert;