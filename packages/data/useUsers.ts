import { useActions } from './src/rest';

interface User {
    id: string;
    name: string;
    email: string;
}

export const useUsers = () => {
    const { useRetrieve } = useActions<User>('/users');

    return {
        useRetrieveUser: useRetrieve,
    };
};