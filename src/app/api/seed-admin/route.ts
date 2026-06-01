import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    const existingUser = await User.findOne({
      email: "admin@lashflow.com",
    });

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "Admin já existe",
      });
    }

    const hashedPassword = await bcrypt.hash(
      "123456",
      10
    );

    const admin = await User.create({
      name: "Administrador",
      email: "admin@lashflow.com",
      password: hashedPassword,
      role: "ADMIN",
    });

    return NextResponse.json({
      success: true,
      message: "Admin criado com sucesso",
      admin,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao criar admin",
      },
      {
        status: 500,
      }
    );
  }
}