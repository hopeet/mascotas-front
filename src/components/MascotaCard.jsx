import { Link } from 'react-router-dom';

function MascotaCard({ mascota }) {
  const { id, nombre, imagen, estado, tipo_animal, raza } = mascota;
  return (
    <article className="mascota-card">
      <img src={imagen} alt={nombre} />
      <h3>{nombre}</h3>
      <p>{tipo_animal} · {raza || 'sin raza'}</p>
      <span className={`badge badge-${estado}`}>{estado}</span>
      <Link to={`/mascotas/${id}`}>Ver detalle</Link>
    </article>
  );
}

export default MascotaCard;