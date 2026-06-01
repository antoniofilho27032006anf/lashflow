import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "MongoDB conectado com sucesso",
    });
  } catch (error) {
    console.error("ERRO MONGODB:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao conectar ao MongoDB",
      },
      { status: 500 }
    );
  }
}