"use client";

import { useEffect, useState } from "react";

type Service = {
  _id: string;
  name: string;
};

export default function BookingPage() {
  const [services, setServices] = useState<Service[]>([]);

  const [clientName, setClientName] =
    useState("");

  const [clientPhone, setClientPhone] =
    useState("");

  const [service, setService] =
    useState("");

  const [appointmentDate, setAppointmentDate] =
    useState("");

  // Carrega os serviços disponíveis
  async function loadServices() {
    try {
      const response = await fetch(
        "/api/services"
      );

      const data = await response.json();

      setServices(data.services || []);
    } catch (error) {
      console.error(error);
    }
  }

  // Cria um novo agendamento
  async function createAppointment() {
    try {
      const response = await fetch(
        "/api/appointments",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            clientName,
            clientPhone,
            service,
            appointmentDate,
          }),
        }
      );

      if (!response.ok) {
        alert(
          "Erro ao criar agendamento"
        );

        return;
      }

      alert(
        "Agendamento realizado com sucesso"
      );

      setClientName("");
      setClientPhone("");
      setService("");
      setAppointmentDate("");
    } catch (error) {
      console.error(error);
    }
  }

  // Carrega os serviços ao abrir a página
  useEffect(() => {
    loadServices();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Agendar Atendimento
      </h1>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Nome"
          value={clientName}
          onChange={(e) =>
            setClientName(
              e.target.value
            )
          }
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Telefone"
          value={clientPhone}
          onChange={(e) =>
            setClientPhone(
              e.target.value
            )
          }
          className="w-full border p-2 rounded"
        />

        <select
          value={service}
          onChange={(e) =>
            setService(
              e.target.value
            )
          }
          className="w-full border p-2 rounded"
        >
          <option value="">
            Selecione um serviço
          </option>

          {services.map((service) => (
            <option
              key={service._id}
              value={service.name}
            >
              {service.name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={appointmentDate}
          onChange={(e) =>
            setAppointmentDate(
              e.target.value
            )
          }
          className="w-full border p-2 rounded"
        />

        <button
          onClick={createAppointment}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Agendar
        </button>
      </div>
    </div>
  );
}