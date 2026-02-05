import { api } from './axios';
import type {
  RegisterPayload,
  LoginPayload,
  AuthResponse,
} from '../types/auth.types';

export const registerUser = async (
  payload: RegisterPayload
): Promise<void> => {
  await api.post('/auth/register', payload);
};

export const loginUser = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
};

export const googleLogin = async (payload: {
  idToken: string;
}): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/google', payload);
  return data;
};
