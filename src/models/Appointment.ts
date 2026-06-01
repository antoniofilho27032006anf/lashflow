import mongoose, { Schema } from "mongoose";

const AppointmentSchema = new Schema(
  {
    // Nome da cliente
    clientName: {
      type: String,
      required: true,
    },

    // Telefone para contato
    clientPhone: {
      type: String,
      required: true,
    },

    // Serviço escolhido
    service: {
      type: String,
      required: true,
    },

    // Data e horário do atendimento
    appointmentDate: {
      type: Date,
      required: true,
    },

    // Situação do agendamento
    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "CANCELED",
      ],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Appointment ||
  mongoose.model(
    "Appointment",
    AppointmentSchema
  );