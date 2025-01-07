import { z } from "zod";

const OrderSchema = z.object({
  rutCliente: z
    .string()
    .min(9, "El RUT debe tener al menos 9 caracteres")
    .max(11, "El RUT no puede tener más de 11 caracteres"),
  items: z
    .array(
      z.object({
        nombreProducto: z.string().min(1, "El nombre del producto es requerido"),
        codigoProducto: z
          .string()
          .min(1, "El código del producto es requerido"),
        precio: z.number().min(0, "El precio debe ser mayor o igual a 0"),
        id_producto: z.number().optional(), // Opcional para nuevos productos
      })
    )
    .min(1, "Debe haber al menos un producto en el pedido"),
  fechaEstimada: z.date().refine((date) => date >= new Date(), {
    message: "La fecha de entrega no puede ser en el pasado",
  }),
  abono: z.number().min(0, "El abono debe ser un valor positivo").optional(),
  num_venta: z.number().optional(), // Opcional para creación
  id_detalle_venta: z.number().optional(), // Opcional para creación
});

// Validación condicional
const OrderSchemaWithContext = OrderSchema.refine(
  (data) => {
    // Si es una actualización, `num_venta` e `id_detalle_venta` deben estar presentes
    if (data.num_venta && data.id_detalle_venta) return true;

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
