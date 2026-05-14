export interface UserRegistrationDto {
  name: string;
  email: string;
  password?: string;
  phone: string;
}

export interface UserLoginDto {
  email: string;
  password?: string;
}

export interface UserMeDto {
  id?: string | number;
  name: string;
  email: string;
  phone?: string;
}

export interface UserLoginResponseDto {
  token: string;
  user?: UserMeDto;
  message?: string;
}

export interface UserRegisterResponseDto {
  id: string;
}

export interface UserApiDto {
  id?: string | number;
  name?: string;
  email?: string;
  phone?: string;
}
