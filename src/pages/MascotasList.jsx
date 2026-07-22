import { useEffect, useState } from 'react';
import api from '../api/api';
import { parsearErrorApi } from '../api/errores';
import MascotaCard from '../components/MascotaCard';
import ErrorAlert from '../components/ErrorAlert';

function MascotasList() {
  const [mascotas, setMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMascotas() {
      try {
        const res = await api.get('/mascotas/');
        setMascotas(res.data);
      } catch (err) {
        setError(parsearErrorApi(err));
      } finally {
        setCargando(false);
      }
    }
    fetchMascotas();
  }, []);

  if (cargando) return <p>Cargando mascotas...</p>;

  return (
    <div>
      <h1>Mascotas</h1>
      <ErrorAlert error={error} />
      <div className="grid-mascotas">
        {mascotas.map((m) => <MascotaCard key={m.id} mascota={m} />)}
      </div>
    </div>
  );
}

export default MascotasList;