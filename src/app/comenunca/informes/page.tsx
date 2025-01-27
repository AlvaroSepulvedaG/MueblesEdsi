"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Table, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Pedido {
  id: number;
  nombre_producto: string;
  precio_producto: number;
  fecha_venta: string;
}

interface Cliente {
  id: number;
  nombre: string;
  rut: string;
}

interface Compra {
  num_compra: number;
  descripcion_compra: string;
  monto_compra: number;
  fecha_compra: string;
}

export default function ReporteMensual() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([]);
  const [filteredCompras, setFilteredCompras] = useState<Compra[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);

  const fetchData = async () => {
    try {
      const [pedidosRes, clientesRes, comprasRes] = await Promise.all([
        fetch("/api/getPedidos"),
        fetch("/api/getClientes"),
        fetch("/api/getCompra"),
      ]);

      const pedidosData = await pedidosRes.json();
      const clientesData = await clientesRes.json();
      const comprasData = await comprasRes.json();

      setPedidos(pedidosData);
      setClientes(clientesData);
      setCompras(comprasData);

      setFilteredPedidos(pedidosData);
      setFilteredCompras(comprasData);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]); 
 
  useEffect(() => {
    filterPedidos();
    filterCompras();
  }, [pedidos, compras, selectedMonth, selectedYear]);

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

  const filterCompras = () => {
    const filtered = compras.filter((compra) => {
      if (!compra.fecha_compra) return false;
      const [year, month] = compra.fecha_compra.split("-");
      return (
        selectedYear === year &&
        (selectedMonth === "all" || month === selectedMonth)
      );
    });
    setFilteredCompras(filtered);
  };

  const calcularIngresosTotales = () =>
    filteredPedidos.reduce((total, pedido) => total + pedido.precio_producto, 0);

  const calcularGastosTotales = () =>
    filteredCompras.reduce((total, compra) => total + compra.monto_compra, 0);

  const calcularGananciasTotales = () =>
    calcularIngresosTotales() - calcularGastosTotales();

  const calcularNumeroVentas = () => filteredPedidos.length;

  const obtenerClientePorId = (id: number): Cliente | undefined => {
    return clientes.find((cliente) => cliente.id === id);
  };

  const obtenerDatosGrafico = () => {
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const ingresosMensuales = new Array(12).fill(0);
    const gastosMensuales = new Array(12).fill(0);

    filteredPedidos.forEach((pedido) => {
      const month = parseInt(pedido.fecha_venta.split("-")[1], 10) - 1;
      ingresosMensuales[month] += pedido.precio_producto;
    });

    filteredCompras.forEach((compra) => {
      const month = parseInt(compra.fecha_compra.split("-")[1], 10) - 1;
      gastosMensuales[month] += compra.monto_compra;
    });

    return {
      labels: meses,
      datasets: [
        {
          label: "Ingresos",
          data: ingresosMensuales,
          backgroundColor: "rgba(37, 99, 235, 0.5)",
          borderColor: "rgba(37, 99, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Gastos",
          data: gastosMensuales,
          backgroundColor: "rgba(220, 38, 38, 0.5)",
          borderColor: "rgba(220, 38, 38, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPedidos = filteredPedidos.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage);

  const formatearRUT = (rut: string): string => {
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
                : new Date(0, parseInt(selectedMonth) - 1).toLocaleString(
                    "es-CL",
                    { month: "long" }
                  )}
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
                  {new Date(0, index).toLocaleString("es-CL", { month: "long" })}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Resumen */}
      <div className="flex space-x-10 mb-6">
        <div className="p-4 bg-white border rounded text-center">
          <h2 className="text-xl font-semibold">Número de Ventas</h2>
          <p className="text-2xl">{calcularNumeroVentas()}</p>
        </div>
        <div className="p-4 bg-white border rounded text-center">
          <h2 className="text-xl font-semibold">Ingresos Totales</h2>
          <p className="text-2xl">
            {calcularIngresosTotales().toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })}
          </p>
        </div>
        <div className="p-4 bg-white border rounded text-center">
          <h2 className="text-xl font-semibold">Gastos Totales</h2>
          <p className="text-2xl">
            {calcularGastosTotales().toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })}
          </p>
        </div>
        <div className="p-4 bg-white border rounded text-center">
          <h2 className="text-xl font-semibold">Ganancia Neta</h2>
          <p className="text-2xl">
            {calcularGananciasTotales().toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Ingresos vs Gastos por Mes</h2>
        <Bar data={obtenerDatosGrafico()} />
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
              currentPedidos.map((pedido) => {
                const cliente = obtenerClientePorId(pedido.id);
                return (
                  <TableRow key={pedido.id}>
                    <TableCell>{pedido.nombre_producto}</TableCell>
                    <TableCell>
                      {formatearMonto(pedido.precio_producto)}
                    </TableCell>
                    <TableCell>{formatearFecha(pedido.fecha_venta)}</TableCell>
                    <TableCell>{cliente ? `${formatearRUT(cliente.rut)}` : "No registrado"}</TableCell>
                  </TableRow>
                );
              })
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
