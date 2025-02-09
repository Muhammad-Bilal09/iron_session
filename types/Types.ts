export type SessionData = {
  user?: {
    id: string;
    email: string;
    password: string;
    name?: string;
  };
};

export type UserSession = {
  id: string;
  email: string;
  name: string;
};

export type Todo = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

export type ReactQueryProviderProps = {
  children: React.ReactNode;
};
