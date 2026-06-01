import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";

export async function GET() {
  try {
    await connectDB();

    const services = await Service.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      services,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao buscar serviços",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      description,
      price,
      duration,
    } = body;

    const service = await Service.create({
      name,
      description,
      price,
      duration,
    });

    return NextResponse.json(
      {
        success: true,
        service,
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
        message: "Erro ao criar serviço",
      },
      {
        status: 500,
      }
    );
  }
}