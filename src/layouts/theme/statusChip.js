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