export type Role = 'PACIENTE' | 'CUIDADOR' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  nome: string;
  tipo_usuario: Role;
  ativo: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User; 
}