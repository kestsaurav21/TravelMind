import { apiRequest } from '../../../lib/api-client';
import type { User } from '../../../app/providers/AuthProvider';

export interface ProfileUpdateInput {
  fullName?: string;
  email?: string;
  password?: string;
}

interface ProfileUpdateResponse {
  success: boolean;
  data: User;
}

export async function updateProfile(data: ProfileUpdateInput): Promise<User> {
  const payload: Record<string, string> = {};
  if (data.fullName !== undefined) payload['fullName'] = data.fullName;
  if (data.email !== undefined) payload['email'] = data.email;
  if (data.password) payload['password'] = data.password;

  const response = await apiRequest<ProfileUpdateResponse>('/users/me', {
    method: 'PUT',
    data: payload,
  });

  return response.data;
}
