// statusChip.js
// Utilitário para converter um status em uma cor semântica do MUI.
//
// Exemplo:
// <Chip color={getStatusChipColor(status)} />

import { statusColorMap } from './tokens';

function normalizeStatus(status) {
    return String(status ?? '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

export function getStatusChipColor(status) {
    const normalizedStatus = normalizeStatus(status);

    return statusColorMap[normalizedStatus] ?? 'default';
}