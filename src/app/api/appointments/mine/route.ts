import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

// Retorna os agendamentos do cliente autenticado filtrados pelo nome da sessão
export async function GET() {
  try {
    // Exige autenticação para acessar este endpoint
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.name) {
      return NextResponse.json(
        { success: false, message: "Não autorizado" },
        { status: 401 }
      );
    }

    await connectDB();

    // Escapa caracteres especiais do nome para uso seguro em regex
    const escapedName = session.user.name
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Busca agendamentos pelo nome do cliente logado (case-insensitive, tolera espaços extras)
    const appointments = await Appointment.find({
      clientName: { $regex: new RegExp(`^\\s*${escapedName}\\s*$`, "i") },
    }).sort({ appointmentDate: -1 });

    return NextResponse.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Erro ao buscar agendamentos" },
      { status: 500 }
    );
  }
}
