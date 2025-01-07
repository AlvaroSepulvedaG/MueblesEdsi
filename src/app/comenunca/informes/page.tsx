"use client";

import { useEffect, useState } from "react";
import { Table, TableRow, TableCell } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import BarChartCust from "@/components/ui/Charts/Chart";

interface Pedido {
  id: number;
  nombre_producto: string;
  precio_producto: number;
  fecha_venta: string;
  cliente_rut: string;
}

interface Cliente {
  id: number;
  nombre: string;
  fecha_registro: string;
}

export default function ReporteMensual() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    fetchPedidos();
  }, []);

  useEffect(() => {
    filterPedidos();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    filterClientes();
  }, [selectedMonth, selectedYear]);

  const fetchPedidos = async () => {
    try {
      const response = await fetch("/api/getPedidos");
      const data = await response.json();
      setPedidos(data);
      setFilteredPedidos(data);
    } catch (error) {
      console.error("Error al cargar los pedidos:", error);
    }
  };

  const filterPedidos = () => {
    const filtered = pedidos.filter((pedido) => {
      if (!pedido.fecha_venta) return false;
      const [year, month] = pedido.fecha_venta.split("-");
      return (
        selectedYear === year &&
        (selectedMonth === "all" || month === selectedMonth)
      );
    });
    setFilteredPedidos(filtered);
    setCurrentPage(1);
  };

  const fetchClientes = async () => {
    try {
      const response = await fetch("/api/getClientes");
      const data = await response.json();
      console.log("Clientes recibidos:", data); // Verifica la estructura de datos
      setClientes(Array.isArray(data) ? data : []); // Asegúrate de que sea un arreglo
      setFilteredClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
    }
  };
  const filterClientes = () => {
    const filtered = clientes.filter((cliente) => {
      if (!cliente.fecha_registro) return false; // Excluir registros inválidos
      const [year, month] = cliente.fecha_registro.split("-");
      return (
        selectedYear === year &&
        (selectedMonth === "all" || month === selectedMonth)
      );
    });
    setFilteredClientes(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchPedidos();
    fetchClientes();
  }, []);

  const calcularDatosGrafico = () => {
    const ventasPorMes: { [key: string]: number } = {};

    filteredPedidos.forEach((pedido) => {
      const [year, month] = pedido.fecha_venta.split("-");
      const clave = `${year}-${month}`;

      ventasPorMes[clave] = (ventasPorMes[clave] || 0) + pedido.precio_producto;
    });

    return Object.keys(ventasPorMes).map((fecha) => ({
      fecha,
      total: ventasPorMes[fecha],
    }));
  };

  const calcularTotalVentas = () => filteredPedidos.length;
  const calcularIngresosTotales = () =>
    filteredPedidos.reduce(
      (total, pedido) => total + pedido.precio_producto,
      0
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPedidos = filteredPedidos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage);

  const formatearMonto = (monto: number): string => {
    if (isNaN(monto)) return "Monto no disponible";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(monto);
  };

  const formatearFecha = (fechaISO: string): string => {
    if (!fechaISO || isNaN(new Date(fechaISO).getTime()))
      return "Fecha inválida";
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  const formatearRUT = (rut: string): string => {
    if (!rut) {
      return "RUT inválido"; // Mensaje por defecto si el RUT no es válido
    }

    const rutLimpio = rut.replace(/\./g, "").replace(/-/g, "");
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);

    const cuerpoFormateado = cuerpo
      .split("")
      .reverse()
      .reduce((acc, digit, i) => {
        return digit + (i > 0 && i % 3 === 0 ? "." : "") + acc;
      }, "");

    return `${cuerpoFormateado}-${dv}`;
  };
  const obtenerNombreMes = (mes: string) => {
    const meses: { [key: string]: string } = {
      "01": "Enero",
      "02": "Febrero",
      "03": "Marzo",
      "04": "Abril",
      "05": "Mayo",
      "06": "Junio",
      "07": "Julio",
      "08": "Agosto",
      "09": "Septiembre",
      "10": "Octubre",
      "11": "Noviembre",
      "12": "Diciembre",
    };
    return meses[mes] || "Mes desconocido";
  };

  useEffect(() => {
    console.log("Clientes filtrados:", filteredClientes); // Verifica el contenido de filteredClientes
  }, [filteredClientes]);

  const calcularClientesNuevos = () => {
    return filteredClientes.length; // Devuelve la cantidad de clientes filtrados
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#DC5F00]">
        Reporte Mensual
      </h1>

      {/* Filtros */}
      <div className="flex space-x-4 mb-6">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-36">
            <span>{selectedYear}</span>
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 9 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-48">
            <span>
              {selectedMonth === "all"
                ? "Todos los meses"
                : obtenerNombreMes(selectedMonth)}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all" value="all">
              Todos los meses
            </SelectItem>
            {Array.from({ length: 12 }, (_, index) => {
              const monthValue = (index + 1).toString().padStart(2, "0");
              return (
                <SelectItem key={monthValue} value={monthValue}>
                  {obtenerNombreMes(monthValue)}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Resumen */}
      <div className="flex space-x-10">
        <div className="p-4 rounded-sm text-center bg-white border-gray-400 border">
          <h2 className="text-xl font-semibold">Total de Ventas</h2>
          <p className="text-2xl">{calcularTotalVentas()}</p>
        </div>
        <div className="p-4 rounded-sm text-center bg-white border-gray-400 border">
          <h2 className="text-xl font-semibold">Ingresos Totales</h2>
          <p className="text-2xl">
            {formatearMonto(calcularIngresosTotales())}
          </p>
        </div>
        <div className="p-4 rounded-sm text-center bg-white border-gray-400 border">
          <h2 className="text-xl font-semibold">Clientes Nuevos</h2>
          <p className="text-2xl">{calcularClientesNuevos()}</p>
        </div>
      </div>

      <div className="mb-6 w-full max-w-6xl">
        <h2 className="flex text-xl font-bold mb-4 justify-center my-5">
          Gráfico de Ventas
        </h2>
        {/* div que contiene los graficos*/}
        <div className="flex justify-between mb-6 space-x-6 font-semibold">
          <div className=" w-[50%] mr-5">
            <BarChartCust
              data={filteredPedidos.map((pedido) => ({
                fecha: pedido.fecha_venta,
              }))}
              title="Ventas por Mes"
              config={{ label: "Ventas nuevas", color: "#2563eb" }}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />
          </div>
          <div className="w-[50%] ml-5">
            <BarChartCust
              data={filteredClientes.map((cliente) => ({
                fecha: cliente.fecha_registro,
              }))}
              title="Clientes Nuevos por Mes"
              config={{ label: "Clientes nuevos", color: "#22c55e" }}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />
          </div>
        </div>
      </div>

      {/* Tabla con paginación */}
      <div className="rounded-lg bg-white p-4 w-full max-w-4xl border-2 border-gray-400 text-center">
        <h2 className="text-xl font-semibold mb-8 text-left">
          Pedidos Generados en el Mes
        </h2>
        <Table>
          <thead className="text-center">
            <tr>
              <th>Producto</th>
              <th>Total</th>
              <th>Fecha</th>
              <th>Cliente</th>
            </tr>
          </thead>
          <tbody>
            {currentPedidos.length ? (
              currentPedidos.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell>{pedido.nombre_producto}</TableCell>
                  <TableCell>
                    {formatearMonto(pedido.precio_producto)}
                  </TableCell>
                  <TableCell>{formatearFecha(pedido.fecha_venta)}</TableCell>
                  <TableCell>{formatearRUT(pedido.cliente_rut)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No se encontraron pedidos.
                </TableCell>
              </TableRow>
            )}
          </tbody>
        </Table>
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="bn"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="bn"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
