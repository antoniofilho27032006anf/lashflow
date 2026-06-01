import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

// Atualiza o status do agendamento
export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const body = await request.json();

    const appointment =
      await Appointment.findByIdAndUpdate(
        id,
        {
          status: body.status,
        },
        {
          new: true,
        }
      );

    if (!appointment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Agendamento não encontrado",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Erro ao atualizar agendamento",
      },
      {
        status: 500,
      }
    );
  }
}