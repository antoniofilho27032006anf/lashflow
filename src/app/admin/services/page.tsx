"use client";

import { useEffect, useState } from "react";

type Service = {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  // Carrega os serviços cadastrados
  async function loadServices() {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();

      setServices(data.services || []);
    } catch (error) {
      console.error(error);
      setServices([]);
    }
  }

  // Cria um novo serviço
  async function createService() {
    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          duration: Number(duration),
        }),
      });

      if (!response.ok) {
        alert("Erro ao criar serviço");
        return;
      }

      setName("");
      setDescription("");
      setPrice("");
      setDuration("");

      loadServices();
    } catch (error) {
      console.error(error);
    }
  }

  // Atualiza um serviço
  async function updateService(
    id: string,
    currentName: string
  ) {
    const newName = window.prompt(
      "Novo nome do serviço:",
      currentName
    );

    if (!newName) return;

    try {
      const response = await fetch(
        `/api/services/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newName,
          }),
        }
      );

      if (!response.ok) {
        alert("Erro ao atualizar serviço");
        return;
      }

      loadServices();
    } catch (error) {
      console.error(error);
    }
  }

  // Remove um serviço
  async function deleteService(id: string) {
    const confirmDelete = window.confirm(
      "Deseja realmente excluir este serviço?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `/api/services/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        alert("Erro ao remover serviço");
        return;
      }

      loadServices();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Gerenciamento de Serviços
      </h1>

      <div className="space-y-3 mb-8">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Duração (min)"
          value={duration}
          onChange={(e) =>
            setDuration(e.target.value)
          }
          className="w-full border p-2 rounded"
        />

        <button
          onClick={createService}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Criar Serviço
        </button>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service._id}
            className="border rounded p-4"
          >
            <h2 className="font-bold text-lg">
              {service.name}
            </h2>

            <p>{service.description}</p>

            <p>R$ {service.price}</p>

            <p>{service.duration} min</p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() =>
                  updateService(
                    service._id,
                    service.name
                  )
                }
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Editar
              </button>

              <button
                onClick={() =>
                  deleteService(service._id)
                }
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}