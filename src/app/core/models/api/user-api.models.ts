export interface UserRegistrationDto {
  nome: string;
  email: string;
  senha: string;
}

export interface UserLoginDto {
  email: string;
  senha: string;
}

export interface UserLoginResponseDto {
  token: string;
  nome: string;
  email: string;
}

export type UserRegisterResponseDto = void;
