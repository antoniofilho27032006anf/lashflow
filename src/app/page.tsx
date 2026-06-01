import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-xl w-full text-center p-8">
        <h1 className="text-5xl font-bold mb-4">
          LashFlow
        </h1>

        <p className="text-gray-600 mb-8">
          Sistema de agendamento para
          atendimento de cílios.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/booking"
            className="bg-black text-white px-4 py-3 rounded"
          >
            Agendar Atendimento
          </Link>

          <Link
            href="/api/auth/signin"
            className="bg-blue-600 text-white px-4 py-3 rounded"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="bg-green-600 text-white px-4 py-3 rounded"
          >
            Cadastro
          </Link>
        </div>
      </div>
    </div>
  );
}