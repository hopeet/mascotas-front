import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { parsearErrorApi } from '../api/errores';
import ErrorAlert from '../components/ErrorAlert';
import Comentarios from '../components/Comentarios';

const ESTADOS = ['perdida', 'encontrada', 'en_adopcion', 'adoptada'];

function MascotaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mascota, setMascota] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  async function fetchMascota() {
    setCargando(true);
    setError(null);
    try {
      const res = await api.get(`/mascotas/${id}/`);
      setMascota(res.data);
    } catch (err) {
      setError(parsearErrorApi(err));
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    fetchMascota();
  }, [id]);

  async function cambiarEstado(nuevoEstado) {
    setError(null);
    try {
      await api.patch(`/mascotas/${id}/`, { estado: nuevoEstado });
      await fetchMascota();
    } catch (err) {
      setError(parsearErrorApi(err));
    }
  }

  async function eliminarMascota() {
    const confirmar = window.confirm(`¿Eliminar a ${mascota.nombre}? Esta acción no se puede deshacer.`);
    if (!confirmar) return;

    setEliminando(true);
    setError(null);
    try {
      await api.delete(`/mascotas/${id}/`);
      navigate('/');
    } catch (err) {
      setError(parsearErrorApi(err));
      setEliminando(false);
    }
  }

  if (cargando) return <p>Cargando mascota...</p>;

  if (error?.tipo === 'no_encontrado') {
    return (
      <div>
        <ErrorAlert error={error} />
        <Link to="/">Volver al listado</Link>
      </div>
    );
  }

  if (!mascota) return null;

  return (
    <div>
      <Link to="/">← Volver al listado</Link>
      <ErrorAlert error={error} />
      <img src={mascota.imagen} alt={mascota.nombre} width="250" />
      <h1>{mascota.nombre}</h1>
      <p>{mascota.descripcion}</p>
      <ul>
        <li><strong>Tipo:</strong> {mascota.tipo_animal}</li>
        <li><strong>Raza:</strong> {mascota.raza || '—'}</li>
        <li><strong>Edad:</strong> {mascota.edad ?? '—'}</li>
      </ul>

      <label htmlFor="estado">Estado:</label>
      <select id="estado" value={mascota.estado} onChange={(e) => cambiarEstado(e.target.value)}>
        {ESTADOS.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
      </select>

      <br /><br />
      <button type="button" onClick={eliminarMascota} disabled={eliminando}>
        {eliminando ? 'Eliminando...' : 'Eliminar mascota'}
      </button>

      <Comentarios
        mascotaId={id}
        comentarios={mascota.comentarios || []}
        onCambio={fetchMascota}
      />
    </div>
  );
}

export default MascotaDetail;