import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find({}).select("email name role createdAt");
    const totalUsers = await User.countDocuments();

    return NextResponse.json({
      success: true,
      totalUsers,
      users,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao buscar usuários",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
