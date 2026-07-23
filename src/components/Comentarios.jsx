import { useState } from 'react';
import api from '../api/api';
import { parsearErrorApi } from '../api/errores';
import ErrorAlert from './ErrorAlert';

function Comentarios({ mascotaId, comentarios, onCambio }) {
  const [autor, setAutor] = useState('');
  const [contenido, setContenido] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function agregarComentario(e) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      // No enviamos "mascota": el atajo /comentar/ lo asocia solo al id de la URL
      await api.post(`/mascotas/${mascotaId}/comentar/`, { autor, contenido });
      setAutor('');
      setContenido('');
      await onCambio(); // refresca el detalle para ver el nuevo comentario
    } catch (err) {
      setError(parsearErrorApi(err));
    } finally {
      setEnviando(false);
    }
  }

  async function eliminarComentario(id) {
    setError(null);
    try {
      await api.delete(`/comentarios/${id}/`);
      await onCambio();
    } catch (err) {
      setError(parsearErrorApi(err));
    }
  }

  return (
    <section>
      <h3>Comentarios ({comentarios.length})</h3>
      <ErrorAlert error={error} />

      {comentarios.length === 0 && <p>Todavía no hay comentarios.</p>}

      <ul>
        {comentarios.map((c) => (
          <li key={c.id}>
            <strong>{c.autor}:</strong> {c.contenido}
            <button type="button" onClick={() => eliminarComentario(c.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={agregarComentario}>
        <input
          type="text"
          placeholder="Tu nombre"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Escribe un comentario..."
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          required
        />
        <button type="submit" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Comentar'}
        </button>
      </form>
    </section>
  );
}

export default Comentarios;