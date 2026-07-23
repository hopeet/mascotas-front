import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { parsearErrorApi } from '../api/errores';
import ErrorAlert from '../components/ErrorAlert';

function MascotaForm() {
  const navigate = useNavigate();

  const [catalogo, setCatalogo] = useState({ estado: [], tipo_animal: [], sexo: [], tamano: [] });
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    edad: '',
    raza: '',
    estado: '',
    tipo_animal: '',
    sexo: '',
    tamano: '',
  });
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // Traemos los catálogos reales en vez de escribir las opciones a mano
  useEffect(() => {
    async function cargarChoices() {
      try {
        const res = await api.get('/choices/');
        setCatalogo(res.data);
        // Preseleccionamos la primera opción de cada catálogo:
        // así el <select> nunca queda vacío (ver nota de la guía sobre sexo/tamaño)
        setForm((prev) => ({
          ...prev,
          estado: res.data.estado[0]?.value ?? '',
          tipo_animal: res.data.tipo_animal[0]?.value ?? '',
          sexo: res.data.sexo[0]?.value ?? '',
          tamano: res.data.tamano[0]?.value ?? '',
        }));
      } catch (err) {
        setError(parsearErrorApi(err));
      }
    }
    cargarChoices();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!imagen) {
      setError({ tipo: 'validacion', mensaje: 'Debes seleccionar una imagen.', detalle: [] });
      return;
    }

    // multipart/form-data es obligatorio porque el body incluye un archivo
    const formData = new FormData();
    formData.append('nombre', form.nombre);
    formData.append('descripcion', form.descripcion);
    formData.append('imagen', imagen);
    if (form.edad) formData.append('edad', form.edad);
    if (form.raza) formData.append('raza', form.raza);
    formData.append('estado', form.estado);
    formData.append('tipo_animal', form.tipo_animal);
    formData.append('sexo', form.sexo);
    formData.append('tamano', form.tamano);

    setEnviando(true);
    try {
      const res = await api.post('/mascotas/', formData);
      navigate(`/mascotas/${res.data.id}`);
    } catch (err) {
      setError(parsearErrorApi(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <h1>Registrar mascota</h1>
      <ErrorAlert error={error} />

      <form onSubmit={handleSubmit}>
        <label>
          Nombre *
          <input name="nombre" value={form.nombre} onChange={handleChange} required maxLength={100} />
        </label>
        <br />
        <label>
          Descripción *
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Imagen *
          <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} required />
        </label>
        <br />
        <label>
          Edad
          <input type="number" min="0" name="edad" value={form.edad} onChange={handleChange} />
        </label>
        <br />
        <label>
          Raza
          <input name="raza" value={form.raza} onChange={handleChange} maxLength={100} />
        </label>
        <br />
        <label>
          Estado
          <select name="estado" value={form.estado} onChange={handleChange}>
            {catalogo.estado.map((op) => <option key={op.value} value={op.value}>{op.label}</option>)}
          </select>
        </label>
        <br />
        <label>
          Tipo de animal
          <select name="tipo_animal" value={form.tipo_animal} onChange={handleChange}>
            {catalogo.tipo_animal.map((op) => <option key={op.value} value={op.value}>{op.label}</option>)}
          </select>
        </label>
        <br />
        <label>
          Sexo
          <select name="sexo" value={form.sexo} onChange={handleChange}>
            {catalogo.sexo.map((op) => <option key={op.value} value={op.value}>{op.label}</option>)}
          </select>
        </label>
        <br />
        <label>
          Tamaño
          <select name="tamano" value={form.tamano} onChange={handleChange}>
            {catalogo.tamano.map((op) => <option key={op.value} value={op.value}>{op.label}</option>)}
          </select>
        </label>
        <br />
        <button type="submit" disabled={enviando}>
          {enviando ? 'Guardando...' : 'Registrar mascota'}
        </button>
      </form>
    </div>
  );
}

export default MascotaForm;