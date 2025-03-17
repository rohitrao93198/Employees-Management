export const formatDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
};

export const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};