export function maskName(name: string) {
    if (name.length <= 1) return "O";
    if (name.length === 2) return `${name[0]}X`;
    return `${name[0]}X${name[name.length - 1]}`;
}

export function maskStudentId(id: string) {
    if (id.length <= 2) return "XX";
    return "XX" + id.slice(2);
}
