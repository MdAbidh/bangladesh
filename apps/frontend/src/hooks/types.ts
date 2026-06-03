export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  bio?: string;
}
