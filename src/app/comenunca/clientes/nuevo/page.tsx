import { ClientForm } from "@/components/ui/Clients/ClientForm";

export default async function NuevoCliente() {
  return (
    <div className="flex flex-col justify-center items-center py-4">
      <h3 className="text-4xl text-[#DC5F00] font-bold">Nuevo cliente</h3>
      <ClientForm />
    </div>
  );
}
