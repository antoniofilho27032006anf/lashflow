// Conexão com o MongoDB Atlas usando o padrão Singleton
// Evita múltiplas conexões em ambiente serverless (Next.js / Vercel)
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Defina MONGODB_URI no .env.local");
}

// Tipagem do cache global de conexão
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declara a variável global para persistir a conexão entre hot reloads
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Reutiliza o cache existente ou cria um novo
let cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

// Garante que o cache global seja inicializado uma única vez
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

// Retorna a conexão existente ou abre uma nova
export async function connectDB(): Promise<typeof mongoose> {
  // Retorna a conexão já estabelecida sem abrir uma nova
  if (cached.conn) {
    return cached.conn;
  }

  // Inicia a conexão apenas uma vez, mesmo com múltiplas chamadas simultâneas
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "lashflow",
    });
  }

  // Aguarda a conexão e armazena no cache
  cached.conn = await cached.promise;

  return cached.conn;
}
