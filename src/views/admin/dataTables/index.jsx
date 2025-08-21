/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import DevelopmentTable from "views/admin/dataTables/components/DevelopmentTable";
import CheckTable from "views/admin/dataTables/components/CheckTable";
import ColumnsTable from "views/admin/dataTables/components/ColumnsTable";
import ComplexTable from "views/admin/dataTables/components/ComplexTable";
import {
    columnsDataDevelopment,
    columnsDataCheck,
    columnsDataReservas,
    columnsDataComplex,
} from "views/admin/dataTables/variables/columnsData";
import tableDataDevelopment from "views/admin/dataTables/variables/tableDataDevelopment.json";
import tableDataCheck from "views/admin/dataTables/variables/tableDataCheck.json";
import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns.json";
import tableDataComplex from "views/admin/dataTables/variables/tableDataComplex.json";
import React, { useState, useEffect } from "react";

export default function Settings() {
    const hoje = new Date();
    const nomeDoDia = hoje.toLocaleDateString('pt-BR', { weekday: 'long' });
    const nomeDoDiaCapitalizado = nomeDoDia.charAt(0).toUpperCase() + nomeDoDia.slice(1);
    const dataFormatada = hoje.toLocaleDateString('pt-BR');
    const headerInfo = {
        diaSemana: nomeDoDiaCapitalizado,
        data: dataFormatada,
    };
    
    // Chakra Color Mode
    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <ColumnsTable columnsData={columnsDataReservas} headerInfo={headerInfo} />
        </Box>
    );
}
