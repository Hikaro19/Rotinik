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

export interface UserLoginResponseDto {
  userId: number;
  userName: string;
  token: string;
}

export type UserRegisterResponseDto = UserLoginResponseDto | void;
