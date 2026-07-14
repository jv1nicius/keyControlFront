// ============================================================
// navConfig.js  —  fonte única de verdade para navegação
//
// Cada item define quais `funcoes` têm acesso.
// O Layout lê essa lista para montar o menu.
// O RoleRoute usa a mesma lista para proteger as rotas.
//
// Adicionar uma nova rota/permissão = mexer SÓ AQUI.
// ============================================================

import DashboardIcon  from "@mui/icons-material/Dashboard";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import VpnKeyIcon     from "@mui/icons-material/VpnKey";
import HistoryIcon    from "@mui/icons-material/History";
import PeopleIcon     from "@mui/icons-material/People";
import SettingsIcon   from "@mui/icons-material/Settings";
import PersonIcon     from "@mui/icons-material/Person";

export const ROLES = {
    ADMIN:     "admin",
    PROFESSOR: "professor",
    ALUNO:     "aluno",
};

// Atalho: todos os papéis
const ALL = [ROLES.ADMIN, ROLES.PROFESSOR, ROLES.ALUNO];

export const NAV_ITEMS = [
    {
        label:  "Dashboard",
        path:   "/",
        icon:   DashboardIcon,
        roles:  ALL,
    },
    {
        label:  "Chaves",
        path:   "/chaves",
        icon:   VpnKeyIcon,
        roles:  ALL,
    },
    {
        label:  "Salas",
        path:   "/salas",
        icon:   MeetingRoomIcon,
        roles:  [ROLES.ADMIN, ROLES.PROFESSOR],   // aluno não vê
    },
    {
        label:  "Histórico",
        path:   "/historico",
        icon:   HistoryIcon,
        roles:  [ROLES.ADMIN, ROLES.PROFESSOR],
    },
    {
        label:  "Usuários",
        path:   "/usuarios",
        icon:   PeopleIcon,
        roles:  [ROLES.ADMIN],                    // só admin
    },
    {
        label:  "Configurações",
        path:   "/settings",
        icon:   SettingsIcon,
        roles:  [ROLES.ADMIN],
    },
    {
        label:  "Perfil",
        path:   "/profile",
        icon:   PersonIcon,
        roles:  ALL,
    },
];

/**
 * Retorna true se o usuário tem acesso ao item de navegação.
 * @param {string} funcao  — valor de user.funcao
 * @param {string[]} roles — lista de roles permitidos no item
 */
export function canAccess(funcao, roles) {
    return roles.includes(funcao);
}