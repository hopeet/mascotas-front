import { useEffect, useState, useCallback } from 'react';
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

  const fetchMascota = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    fetchMascota();
  }, [fetchMascota]);

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

  if (cargando) return <p className="texto-cargando">Cargando mascota...</p>;

  if (error?.tipo === 'no_encontrado') {
    return (
      <div className="pagina-detalle">
        <ErrorAlert error={error} />
        <Link to="/" className="volver">← Volver al listado</Link>
      </div>
    );
  }

  if (!mascota) return null;

  return (
    <div className="pagina-detalle">
      <Link to="/" className="volver">← Volver al listado</Link>
      <ErrorAlert error={error} />

      <div className="detalle-card">
        <img src={mascota.imagen} alt={mascota.nombre} className="detalle-imagen" />

        <div className="detalle-info">
          <h1 className="detalle-nombre">{mascota.nombre}</h1>
          <p className="detalle-descripcion">{mascota.descripcion}</p>

          <ul className="detalle-lista">
            <li><strong>Tipo:</strong> {mascota.tipo_animal}</li>
            <li><strong>Raza:</strong> {mascota.raza || '—'}</li>
            <li><strong>Edad:</strong> {mascota.edad ?? '—'}</li>
          </ul>

          <label htmlFor="estado" className="detalle-label">Estado:</label>
          <select id="estado" value={mascota.estado} onChange={(e) => cambiarEstado(e.target.value)}>
            {ESTADOS.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
          </select>

          <div className="detalle-acciones">
            <button type="button" onClick={eliminarMascota} disabled={eliminando}>
              {eliminando ? 'Eliminando...' : 'Eliminar mascota'}
            </button>
          </div>
        </div>
      </div>

      <Comentarios
        mascotaId={id}
        comentarios={mascota.comentarios || []}
        onCambio={fetchMascota}
      />
    </div>
  );
}

export default MascotaDetail;