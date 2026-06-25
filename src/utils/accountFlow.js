export const getPostLoginPath = (role) => (role === 'admin' ? '/dashboard' : '/store');
