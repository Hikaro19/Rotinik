export interface UserRegistrationDto {
  name: string;
  birthDate: string;
  userName: string;
  password: string;
  email: string;
}

export interface UserLoginDto {
  userName: string;
  password: string;
}

export interface AuthResponse {
  userId: string | number;
  userName: string;
  token: string;
}

export type UserLoginResponseDto = AuthResponse;

export interface UserRegisterResponseDto {
  userId?: string | number;
  userName?: string;
  message?: string;
}

export interface UserMeDto {
  userId?: string | number;
  userName?: string;
  name?: string;
  email?: string;
}

export interface UserApiDto {
  id?: string | number;
  userId?: string | number;
  userName?: string;
  name?: string;
  email?: string;
}
