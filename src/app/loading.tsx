// Exibe a tela de carregamento

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Carregando...
        </h2>

        <p className="text-gray-500 mt-2">
          Aguarde um momento
        </p>
      </div>
    </div>
  );
}