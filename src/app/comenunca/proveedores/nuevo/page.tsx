import { ClientForm } from "@/components/ui/Clients/ClientForm";
import { SupplierForm } from "@/components/ui/Supplier/SupplierForm";

export default async function NuevoProveedor() {
  return (
    <div className="flex flex-col justify-center items-center py-4">
      <h3 className="text-4xl text-[#DC5F00] font-bold">Nuevo proveedor</h3>
      <SupplierForm/>
    </div>
  );
}
