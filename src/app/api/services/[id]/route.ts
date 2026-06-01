import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: NextRequest,
  { params }: Params
) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await request.json();

    const service =
      await Service.findByIdAndUpdate(
        id,
        body,
        {
          new: true,
        }
      );

    return NextResponse.json({
      success: true,
      service,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao atualizar serviço",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: Params
) {
  try {
    await connectDB();

    const { id } = await params;

    await Service.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Serviço removido",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao remover serviço",
      },
      {
        status: 500,
      }
    );
  }
}