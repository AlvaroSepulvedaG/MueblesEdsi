//wip

import { z } from "zod";

const CompraSchema = z.object({
  numCompra: z
    .number()
    .optional(),
  descripcionCompra: z
    .string()
    .max(300, "La descripción debe tener como máximo 300 caracteres"),
  montoCompra: z
    .number()
    .min(0, "El monto de la compra debe ser un valor positivo"),
  folioDocumento: z
    .number()
    .optional(),
  fechaCompra: z
    .date(),
  rutProveedor: z
    .string()
    .min(9, "El RUT debe tener al menos 9 caracteres")
    .max(11, "El RUT no puede tener más de 11 caracteres"),
  tipoDocumento: z
    .number()
});

export default CompraSchema;
/* Validación condicional
const CompraSchemaWithContext = CompraSchema.refine(
  (data) => {
    // Si es una actualización, `num_compra`debe estar presente
    if (data.num_compra) return true;

    // Si es una creación, ambos deben estar ausentes
    if (!data.num_venta && !data.id_detalle_venta) return true;

    return false; // Caso inválido si uno está presente y el otro no
  },
  {
    message: "Datos inválidos para crear o actualizar el pedido",
    path: ["num_venta", "id_detalle_venta"],
  }
);

export default OrderSchemaWithContext;   
*/

