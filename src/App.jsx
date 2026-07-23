import { Routes, Route } from 'react-router-dom';
import MascotasList from './pages/MascotasList';
import MascotaDetail from './pages/MascotaDetail';
import MascotaForm from './pages/MascotaForm';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MascotasList />} />
      <Route path="/mascotas/nueva" element={<MascotaForm />} />
      <Route path="/mascotas/:id" element={<MascotaDetail />} />
    </Routes>
  );
}

export default App;