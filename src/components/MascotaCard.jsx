function MascotaCard({ mascota }) {
  const { nombre, imagen, estado, tipo_animal, raza } = mascota;
  return (
    <article className="mascota-card">
      <img src={imagen} alt={nombre} />
      <h3>{nombre}</h3>
      <p>{tipo_animal} · {raza || 'sin raza'}</p>
      <span className={`badge badge-${estado}`}>{estado}</span>
    </article>
  );
}

export default MascotaCard;