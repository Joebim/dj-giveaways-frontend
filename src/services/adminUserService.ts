import api from "./api";
import { unwrapResponse } from "./http";
import type {
  AdminUserFilters,
  CreateAdminUserRequest,
  ResetUserPasswordRequest,
  UpdateAdminUserRequest,
  User,
  UserRole,
} from "../types";

type RawUser = Record<string, any>;

interface UserListPayload {
  users: RawUser[];
}

interface UserPayload {
  user: RawUser;
}

export interface AdminUserListResult {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

const ADMIN_USERS_BASE = "/admin/users";

const normalizeUser = (user: RawUser): User => ({
  _id: user._id || user.id || "",
  firstName: user.firstName ?? "",
  lastName: user.lastName ?? "",
  email: user.email ?? "",
  phone: user.phone ?? undefined,
  role: (user.role ?? "user") as UserRole,
  isVerified: Boolean(user.isVerified),
  isActive: user.isActive !== undefined ? Boolean(user.isActive) : true,
  subscribedToNewsletter: Boolean(user.subscribedToNewsletter),
  createdAt: user.createdAt ?? "",
  updatedAt: user.updatedAt ?? "",
});

class AdminUserService {
  async getUsers(
    params: AdminUserFilters = {}
  ): Promise<AdminUserListResult> {
    const response = await api.get<UserListPayload>(ADMIN_USERS_BASE, {
      params,
    });
    const { data, meta } = unwrapResponse<UserListPayload>(response);

    const paginationMeta =
      (meta?.pagination as Record<string, any> | undefined) ?? {};

    return {
      users: (data?.users ?? []).map(normalizeUser),
      pagination: {
        page: Number(paginationMeta.page ?? params.page ?? 1),
        limit: Number(paginationMeta.limit ?? params.limit ?? 10),
        totalItems: Number(
          paginationMeta.totalItems ??
            paginationMeta.total ??
            (data?.users?.length ?? 0)
        ),
        totalPages: Number(paginationMeta.totalPages ?? paginationMeta.pages ?? 1),
      },
    };
  }

  async getUserById(userId: string): Promise<User> {
    const response = await api.get<UserPayload>(`${ADMIN_USERS_BASE}/${userId}`);
    const { data } = unwrapResponse<UserPayload>(response);
    return normalizeUser(data.user);
  }

  async createUser(payload: CreateAdminUserRequest): Promise<User> {
    const response = await api.post<UserPayload>(ADMIN_USERS_BASE, payload);
    const { data } = unwrapResponse<UserPayload>(response);
    return normalizeUser(data.user);
  }

  async updateUser(
    userId: string,
    payload: UpdateAdminUserRequest
  ): Promise<User> {
    const response = await api.patch<UserPayload>(
      `${ADMIN_USERS_BASE}/${userId}`,
      payload
    );
    const { data } = unwrapResponse<UserPayload>(response);
    return normalizeUser(data.user);
  }

  async updateUserStatus(
    userId: string,
    isActive?: boolean
  ): Promise<User> {
    const response = await api.patch<UserPayload>(
      `${ADMIN_USERS_BASE}/${userId}/status`,
      isActive === undefined ? undefined : { isActive }
    );
    const { data } = unwrapResponse<UserPayload>(response);
    return normalizeUser(data.user);
  }

  async resetPassword(
    userId: string,
    payload: ResetUserPasswordRequest
  ): Promise<User> {
    const response = await api.post<UserPayload>(
      `${ADMIN_USERS_BASE}/${userId}/reset-password`,
      payload
    );
    const { data } = unwrapResponse<UserPayload>(response);
    return normalizeUser(data.user);
  }

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`${ADMIN_USERS_BASE}/${userId}`);
  }
}

const adminUserService = new AdminUserService();

export default adminUserService;

