export function validateTitle(title) {
    if (typeof title !== 'string') {
        return false;
    }
    const trimmed = title.trim();
    return trimmed.length >= 3;
}