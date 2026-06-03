import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

// Lista todos os agendamentos
export async function GET() {
  try {
    await connectDB();

    const appointments =
      await Appointment.find().sort({
        appointmentDate: 1,
      });

    return NextResponse.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Erro ao buscar agendamentos",
      },
      {
        status: 500,
      }
    );
  }
}

// Cria um novo agendamento
export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body =
      await request.json();

    // DIAGNÓSTICO
    console.log(
      "BODY RECEBIDO:",
      body
    );

    const appointment =
      await Appointment.create(body);

    return NextResponse.json(
      {
        success: true,
        appointment,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Erro ao criar agendamento",
      },
      {
        status: 500,
      }
    );
  }
}