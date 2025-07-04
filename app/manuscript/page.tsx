import ManuscriptPage from "@/components/pages/manuscript-page";

export default function ManuscriptRoute() {
  // Aquí puedes obtener el projectId y projectTitle desde contexto, props, o mock para pruebas
  // Por ahora, lo dejamos en null para que el componente funcione igual que las otras páginas
  return <ManuscriptPage projectId={null} projectTitle={"Sin título"} />;
} 