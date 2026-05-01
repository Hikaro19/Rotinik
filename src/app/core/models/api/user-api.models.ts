export interface UserRegistrationDto {
  Nome: string;
  Email: string;
  Senha: string;
}

export interface UserLoginDto {
  Email: string;
  Senha: string;
}

export interface UserLoginUserDto {
  Id: string | number;
  Nome: string;
  Email: string;
}

export interface UserLoginResponseDto {
  token: string;
  user: UserLoginUserDto;
  message: string;
}

export type UserRegisterResponseDto = void;

export interface UserApiDto {
  Id?: string | number;
  id?: string | number;
  UserId?: string | number;
  userId?: string | number;
  Nome?: string;
  nome?: string;
  Email?: string;
  email?: string;
}
