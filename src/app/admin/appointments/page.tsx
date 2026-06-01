"use client";

import { useEffect, useState } from "react";

type Appointment = {
  _id: string;
  clientName: string;
  clientPhone: string;
  service: string;
  appointmentDate: string;
  status: string;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  // Carrega os agendamentos cadastrados
  async function loadAppointments() {
    try {
      const response = await fetch(
        "/api/appointments"
      );

      const data = await response.json();

      setAppointments(
        data.appointments || []
      );
    } catch (error) {
      console.error(error);
    }
  }

  // Atualiza o status do agendamento
  async function updateStatus(
    id: string,
    status: string
  ) {
    try {
      const response = await fetch(
        `/api/appointments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      if (!response.ok) {
        alert(
          "Erro ao atualizar status"
        );
        return;
      }

      // Atualiza a lista na tela
      loadAppointments();
    } catch (error) {
      console.error(error);
    }
  }

  // Carrega os dados ao abrir a página
  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Agendamentos
      </h1>

      <div className="space-y-4">
        {appointments.map(
          (appointment) => (
            <div
              key={appointment._id}
              className="border rounded p-4"
            >
              <h2 className="font-bold text-lg">
                {
                  appointment.clientName
                }
              </h2>

              <p>
                Telefone:{" "}
                {
                  appointment.clientPhone
                }
              </p>

              <p>
                Serviço:{" "}
                {appointment.service}
              </p>

              <p>
                Data:{" "}
                {new Date(
                  appointment.appointmentDate
                ).toLocaleString()}
              </p>

              <p>
                Status:{" "}
                {appointment.status}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() =>
                    updateStatus(
                      appointment._id,
                      "CONFIRMED"
                    )
                  }
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Confirmar
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      appointment._id,
                      "CANCELED"
                    )
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}