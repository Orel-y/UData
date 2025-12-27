export interface MockUser {
  id: number;
  email: string;
  username: string;
  avatarUrl?: string;
  isAdmin?: boolean;
  permittedCampusIds?: number[];
}

const USERS_KEY = 'uDataMockUsers';

const loadUsers = (): MockUser[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) as MockUser[] : [];
  } catch (e) {
    console.error('Failed to load users', e);
    return [];
  }
};

const saveUsers = (users: MockUser[]) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
};

export const getUsers = (): MockUser[] => loadUsers();

export const addUser = (user: Omit<MockUser, 'id'>): MockUser => {
  const users = loadUsers();
  const id = Date.now();
  const created = { id, ...user } as MockUser;
  users.push(created);
  saveUsers(users);
  return created;
};

export const findUserByEmail = (email: string): MockUser | undefined => loadUsers().find(u => u.email === email);

export const clearUsers = () => saveUsers([]);
