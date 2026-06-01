"use client";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

// Exibe erros da aplicação
export default function Error({
  error,
  reset,
}: ErrorProps) {
  console.error(error);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">
          Ocorreu um erro
        </h1>

        <p className="text-gray-500 mb-4">
          Tente novamente.
        </p>

        <button
          onClick={reset}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Recarregar
        </button>
      </div>
    </div>
  );
}