{\rtf1\ansi\ansicpg1252\deff0\nouicompat\deflang2058{\fonttbl{\f0\fnil\fcharset0 Calibri;}}
{\*\generator Riched20 10.0.22621}\viewkind4\uc1 
\pard\sa200\sl276\slmult1\f0\fs22\lang10 CREATE DATABASE  IF NOT EXISTS `edsiv2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;\par
USE `edsiv2`;\par
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)\par
--\par
-- Host: 127.0.0.1    Database: edsiv2\par
-- ------------------------------------------------------\par
-- Server version\tab 8.0.29\par
\par
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;\par
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;\par
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;\par
/*!50503 SET NAMES utf8 */;\par
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;\par
/*!40103 SET TIME_ZONE='+00:00' */;\par
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;\par
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;\par
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;\par
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;\par
\par
--\par
-- Table structure for table `cliente`\par
--\par
\par
DROP TABLE IF EXISTS `cliente`;\par
/*!40101 SET @saved_cs_client     = @@character_set_client */;\par
/*!50503 SET character_set_client = utf8mb4 */;\par
CREATE TABLE `cliente` (\par
  `rut` varchar(9) NOT NULL,\par
  `nombres` varchar(100) NOT NULL,\par
  `apellido_paterno` varchar(100) DEFAULT NULL,\par
  `apellido_materno` varchar(100) DEFAULT NULL,\par
  `fecha_nacimiento` varchar(10) DEFAULT NULL,\par
  `direccion` varchar(200) DEFAULT NULL,\par
  `telefono_fijo` varchar(10) DEFAULT NULL,\par
  `telefono_movil` varchar(10) DEFAULT NULL,\par
  `correo` varchar(200) DEFAULT NULL,\par
  `comentarios` varchar(1000) DEFAULT NULL,\par
  `comuna_id_comuna` int NOT NULL,\par
  PRIMARY KEY (`rut`),\par
  KEY `fk_Cliente_Comuna1_idx` (`comuna_id_comuna`),\par
  CONSTRAINT `fk_Cliente_Comuna1` FOREIGN KEY (`comuna_id_comuna`) REFERENCES `comuna` (`id_comuna`)\par
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\par
/*!40101 SET character_set_client = @saved_cs_client */;\par
\par
--\par
-- Table structure for table `compra`\par
--\par
\par
DROP TABLE IF EXISTS `compra`;\par
/*!40101 SET @saved_cs_client     = @@character_set_client */;\par
/*!50503 SET character_set_client = utf8mb4 */;\par
CREATE TABLE `compra` (\par
  `num_compra` int NOT NULL AUTO_INCREMENT,\par
  `rut_proveedor` varchar(9) NOT NULL,\par
  `descripcion_compra` varchar(300) NOT NULL,\par
  `monto_compra` int NOT NULL,\par
  `folio_documento` int DEFAULT NULL,\par
  `fecha_compra` datetime NOT NULL,\par
  `Proveedor_rut_proveedor` varchar(9) NOT NULL,\par
  `Tipo Documento_id_tipo_documento` int NOT NULL,\par
  PRIMARY KEY (`num_compra`),\par
  KEY `fk_Compra_Proveedor1_idx` (`Proveedor_rut_proveedor`),\par
  KEY `fk_Compra_Tipo Documento1_idx` (`Tipo Documento_id_tipo_documento`),\par
  CONSTRAINT `fk_Compra_Proveedor1` FOREIGN KEY (`Proveedor_rut_proveedor`) REFERENCES `proveedor` (`rut_proveedor`),\par
  CONSTRAINT `fk_Compra_Tipo Documento1` FOREIGN KEY (`Tipo Documento_id_tipo_documento`) REFERENCES `tipo_documento` (`id_tipo_documento`)\par
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\par
/*!40101 SET character_set_client = @saved_cs_client */;\par
\par
--\par
-- Table structure for table `comuna`\par
--\par
\par
DROP TABLE IF EXISTS `comuna`;\par
/*!40101 SET @saved_cs_client     = @@character_set_client */;\par
/*!50503 SET character_set_client = utf8mb4 */;\par
CREATE TABLE `comuna` (\par
  `id_comuna` int NOT NULL AUTO_INCREMENT,\par
  `nombre_comuna` varchar(45) NOT NULL,\par
  PRIMARY KEY (`id_comuna`)\par
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\par
/*!40101 SET character_set_client = @saved_cs_client */;\par
\par
--\par
-- Table structure for table `detalle_venta`\par
--\par
\par
DROP TABLE IF EXISTS `detalle_venta`;\par
/*!40101 SET @saved_cs_client     = @@character_set_client */;\par
/*!50503 SET character_set_client = utf8mb4 */;\par
CREATE TABLE `detalle_venta` (\par
  `id_detalle_venta` int NOT NULL AUTO_INCREMENT,\par
  `cantidad` int NOT NULL,\par
  `Producto_id_producto` int NOT NULL,\par
  `Venta_num_venta` int NOT NULL,\par
  `precio` int DEFAULT NULL,\par
  PRIMARY KEY (`id_detalle_venta`),\par
  KEY `fk_Detalle Venta_Producto1_idx` (`Producto_id_producto`),\par
  KEY `fk_Detalle Venta_Venta1_idx` (`Venta_num_venta`),\par
  CONSTRAINT `fk_Detalle Venta_Producto1` FOREIGN KEY (`Producto_id_producto`) REFERENCES `producto` (`id_producto`),\par
  CONSTRAINT `fk_Detalle Venta_Venta1` FOREIGN KEY (`Venta_num_venta`) REFERENCES `venta` (`num_venta`)\par
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\par
/*!40101 SET character_set_client = @saved_cs_client */;\par
\par
--\par
-- Table structure for table `producto`\par
--\par
\par
DROP TABLE IF EXISTS `producto`;\par
/*!40101 SET @saved_cs_client     = @@character_set_client */;\par
/*!50503 SET character_set_client = utf8mb4 */;\par
CREATE TABLE `producto` (\par
  `id_producto` int NOT NULL AUTO_INCREMENT,\par
  `cod_producto` varchar(9),\par
  `nombre_producto` varchar(200) NOT NULL,\par
  `precio_producto` int NOT NULL,\par
  PRIMARY KEY (`id_producto`)\par
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\par
/*!40101 SET character_set_client = @saved_cs_client */;\par
\par
--\par
-- Table structure for table `proveedor`\par
--\par
\par
DROP TABLE IF EXISTS `proveedor`;\par
/*!40101 SET @saved_cs_client     = @@character_set_client */;\par
/*!50503 SET character_set_client = utf8mb4 */;\par
CREATE TABLE `proveedor` (\par
  `rut_proveedor` varchar(9) NOT NULL,\par
  `nombre_proveedor` varchar(100) NOT NULL,\par
  `telefono_proveedor` int DEFAULT NULL,\par
  `correo_proveedor` varchar(200) DEFAULT NULL,\par
  PRIMARY KEY (`rut_proveedor`)\par
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\par
/*!40101 SET character_set_client = @saved_cs_client */;\par
\par
--\par
-- Table structure for table `tipo_documento`\par
--\par
\par
DROP TABLE IF EXISTS `tipo_documento`;\par
/*!40101 SET @saved_cs_client     = @@character_set_client */;\par
/*!50503 SET character_set_client = utf8mb4 */;\par
CREATE TABLE `tipo_documento` (\par
  `id_tipo_documento` int NOT NULL,\par
  `nombre_tipo_documento` varchar(100) NOT NULL,\par
  PRIMARY KEY (`id_tipo_documento`)\par
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\par
/*!40101 SET character_set_client = @saved_cs_client */;\par
\par
--\par
-- Table structure for table `venta`\par
--\par
\par
DROP TABLE IF EXISTS `venta`;\par
/*!40101 SET @saved_cs_client     = @@character_set_client */;\par
/*!50503 SET character_set_client = utf8mb4 */;\par
CREATE TABLE `venta` (\par
  `num_venta` int NOT NULL AUTO_INCREMENT,\par
  `Cliente_rut` varchar(9) NOT NULL,\par
  `fecha_entrega` datetime DEFAULT NULL,\par
  `estado` varchar(30) DEFAULT NULL,\par
  `abono` int DEFAULT NULL,\par
  `fecha_venta` datetime DEFAULT NULL,\par
  `fecha_estimada` datetime DEFAULT NULL,\par
  PRIMARY KEY (`num_venta`),\par
  KEY `fk_Venta_Cliente_idx` (`Cliente_rut`),\par
  CONSTRAINT `fk_Venta_Cliente` FOREIGN KEY (`Cliente_rut`) REFERENCES `cliente` (`rut`)\par
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;\par
/*!40101 SET character_set_client = @saved_cs_client */;\par
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;\par
\par
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;\par
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;\par
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;\par
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;\par
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;\par
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;\par
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;\par
\par
-- Dump completed on 2024-11-16  1:15:24\par
}
 