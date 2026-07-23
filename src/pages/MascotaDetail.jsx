import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { parsearErrorApi } from '../api/errores';
import ErrorAlert from '../components/ErrorAlert';

function MascotaDetail() {
  const { id } = useParams();
  const [mascota, setMascota] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

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
        <li><strong>Estado:</strong> {mascota.estado}</li>
      </ul>
    </div>
  );
}

export default MascotaDetail;