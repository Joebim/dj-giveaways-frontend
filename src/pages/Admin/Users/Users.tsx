import React, { useEffect, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaEdit,
  FaEnvelope,
  FaKey,
  FaPlus,
  FaSearch,
  FaShieldAlt,
  FaSync,
  FaTrash,
  FaUserSlash,
  FaUserTie,
} from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../../components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminUserService } from "../../../services";
import Button from "../../../components/common/Button/Button";
import toast from "react-hot-toast";
import ConfirmationModal from "../../../components/common/ConfirmationModal/ConfirmationModal";
import UserFormModal, { type UserFormValues } from "./UserFormModal";
import ResetPasswordModal from "./ResetPasswordModal";
import type { AdminUserFilters, User } from "../../../types";

type RoleFilter = "all" | AdminUserFilters["role"];
type StatusFilter = "all" | "active" | "inactive";
type AdminUserListResult = Awaited<
  ReturnType<typeof adminUserService.getUsers>
>;

const Users: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [userToReset, setUserToReset] = useState<User | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);
  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter, statusFilter]);


  const {
    data,
    isLoading,
    isFetching,
  } = useQuery<AdminUserListResult>({
    queryKey: [
      "admin",
      "users",
      {
        page,
        limit,
        role: roleFilter,
        status: statusFilter,
        search: debouncedSearch,
      },
    ],
    queryFn: () =>
      adminUserService.getUsers({
        page,
        limit,
        role: roleFilter === "all" ? undefined : roleFilter,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: debouncedSearch || undefined,
      }),
    staleTime: 30_000,
  });

  const users = data?.users ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.totalItems ?? 0;

  const invalidateUsers = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

  const createMutation = useMutation({
    mutationFn: adminUserService.createUser.bind(adminUserService),
    onSuccess: () => {
      toast.success("User created successfully");
      invalidateUsers();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to create user";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: Parameters<typeof adminUserService.updateUser>[1];
    }) => adminUserService.updateUser(userId, payload),
    onSuccess: () => {
      toast.success("User updated successfully");
      invalidateUsers();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to update user";
      toast.error(message);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({
      userId,
      isActive,
    }: {
      userId: string;
      isActive: boolean;
    }) => adminUserService.updateUserStatus(userId, isActive),
    onSuccess: (result) => {
      toast.success(
        `User has been ${result.isActive ? "activated" : "deactivated"}.`
      );
      invalidateUsers();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to update status";
      toast.error(message);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({
      userId,
      password,
    }: {
      userId: string;
      password: string;
    }) => adminUserService.resetPassword(userId, { password }),
    onSuccess: () => {
      toast.success("Password reset successfully");
      invalidateUsers();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to reset password";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => adminUserService.deleteUser(userId),
    onSuccess: () => {
      toast.success("User deleted successfully");
      invalidateUsers();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to delete user";
      toast.error(message);
    },
  });

  const handleCreate = () => {
    setFormMode("create");
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setFormMode("edit");
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleOpenResetPassword = (user: User) => {
    setUserToReset(user);
    setIsResetModalOpen(true);
  };

  const handleOpenDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleOpenStatusToggle = (user: User) => {
    setUserToToggle(user);
    setIsStatusModalOpen(true);
  };

  const handleSubmitUser = async (values: UserFormValues) => {
    const payloadBase = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() || undefined,
      role: values.role,
      isVerified: values.isVerified,
      isActive: values.isActive,
      subscribedToNewsletter: values.subscribedToNewsletter,
    };

    if (formMode === "create") {
      await createMutation.mutateAsync({
        ...payloadBase,
        password: values.password,
      });
    } else if (formMode === "edit" && selectedUser) {
      const payload: Record<string, any> = {};

      (Object.keys(payloadBase) as Array<keyof typeof payloadBase>).forEach(
        (key) => {
          const incomingValue = payloadBase[key];
          const currentValue = (selectedUser as Record<string, any>)[key];
          if (
            typeof incomingValue === "string" &&
            typeof currentValue === "string"
          ) {
            if (incomingValue !== currentValue) {
              payload[key] = incomingValue;
            }
          } else if (incomingValue !== currentValue) {
            payload[key] = incomingValue as never;
          }
        }
      );

      if (Object.keys(payload).length === 0) {
        toast("No changes detected.", { icon: "ℹ️" });
        return;
      }

      await updateMutation.mutateAsync({
        userId: selectedUser._id,
        payload,
      });
    }
  };

  const handleConfirmStatusToggle = async () => {
    if (!userToToggle) {
      return;
    }
    await toggleStatusMutation.mutateAsync({
      userId: userToToggle._id,
      isActive: !userToToggle.isActive,
    });
    setIsStatusModalOpen(false);
    setUserToToggle(null);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) {
      return;
    }
    await deleteMutation.mutateAsync(userToDelete._id);
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleResetPassword = async (password: string) => {
    if (!userToReset) {
      return;
    }
    await resetPasswordMutation.mutateAsync({
      userId: userToReset._id,
      password,
    });
    setUserToReset(null);
  };

  const statusBadge = (user: User) =>
    user.isActive ? (
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-300">
        <FaCheckCircle className="h-3 w-3" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-red-300">
        <FaUserSlash className="h-3 w-3" />
        Inactive
      </span>
    );

  const verifiedBadge = (user: User) =>
    user.isVerified ? (
      <span className="inline-flex items-center gap-1 rounded-full border border-gold-primary/40 bg-gold-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-gold-primary">
        <FaShieldAlt className="h-3 w-3" />
        Verified
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-white/60">
        Pending
      </span>
    );

  const newsletterBadge = (user: User) =>
    user.subscribedToNewsletter ? (
      <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/40 bg-sky-500/10 px-2 py-1 text-xs font-semibold uppercase tracking-widest text-sky-300">
        <FaEnvelope className="h-3 w-3" />
        Opted-in
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs font-semibold uppercase tracking-widest text-white/60">
        Opted-out
      </span>
    );

  const isBusy =
    createMutation.isPending ||
    updateMutation.isPending ||
    toggleStatusMutation.isPending ||
    resetPasswordMutation.isPending ||
    deleteMutation.isPending;

  const roleOptions = useMemo(
    () => [
      { label: "All roles", value: "all" },
      { label: "User", value: "user" },
      { label: "Admin", value: "admin" },
      { label: "Moderator", value: "moderator" },
      { label: "Super Admin", value: "super_admin" },
    ],
    []
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-light text-white gold-text-glow mb-2">
            Manage Users
          </h1>
          <p className="text-white/60 text-sm font-light uppercase tracking-wider">
            Search, filter, and manage customer access across the platform.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          variant="primary"
          size="md"
          withBrackets
          leftIcon={<FaPlus className="h-4 w-4" />}
        >
          New User
        </Button>
      </header>

      <section className="bg-black border border-gold-primary/20 rounded-lg p-6 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4" />
            <input
              type="search"
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <select
              value={roleFilter ?? "all"}
              onChange={(event) =>
                setRoleFilter(event.target.value as RoleFilter)
              }
              className="px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="px-4 py-3 bg-black border border-gold-primary/20 rounded-lg text-white focus:ring-2 focus:ring-gold-primary focus:border-gold-primary transition-all outline-none"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-white/50 font-light">
          <span>
            Showing{" "}
            <strong className="text-gold-primary">
              {users.length ? (page - 1) * limit + 1 : 0}-
              {(page - 1) * limit + users.length}
            </strong>{" "}
            of{" "}
            <strong className="text-gold-primary">{totalItems}</strong> users
          </span>
          {isFetching && (
            <span className="inline-flex items-center gap-2 text-gold-primary/70">
              <FaSync className="h-3 w-3 animate-spin" />
              Updating…
            </span>
          )}
        </div>
      </section>

      <section className="bg-black border border-gold-primary/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gold-primary/10 text-xs md:text-sm">
            <thead className="bg-black/60 backdrop-blur-md">
              <tr className="text-left text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                <th className="px-4 py-3 md:px-5 md:py-3.5">User</th>
                <th className="px-4 py-3 md:px-5 md:py-3.5">Role</th>
                <th className="px-4 py-3 md:px-5 md:py-3.5">Status</th>
                <th className="px-4 py-3 md:px-5 md:py-3.5">Verification</th>
                <th className="px-4 py-3 md:px-5 md:py-3.5">Newsletter</th>
                <th className="px-4 py-3 md:px-5 md:py-3.5 hidden xl:table-cell">Created</th>
                <th className="px-3 py-3 w-0 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/10 text-[12px] md:text-[13px]">
              {isLoading ? (
                Array.from({ length: limit }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3" colSpan={7}>
                      <div className="h-7 bg-gold-primary/5 animate-pulse rounded" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-white/60 font-light text-xs md:text-sm" colSpan={7}>
                    No users found. Adjust your search or filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="text-white/80 hover:bg-gold-primary/5 transition-colors"
                  >
                    <td className="px-4 py-3 md:px-5 md:py-3.5">
                      <div className="flex flex-col">
                        <span className="text-sm md:text-base font-semibold text-white">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-xs text-white/60">
                          {user.email}
                        </span>
                        {user.phone && (
                          <span className="text-xs text-white/40">
                            {user.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-5 md:py-3.5">
                      <span className="inline-flex items-center gap-2 rounded-full border border-gold-primary/30 bg-gold-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-gold-primary">
                        <FaUserTie className="h-2.5 w-2.5" />
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 md:px-5 md:py-3.5">{statusBadge(user)}</td>
                    <td className="px-4 py-3 md:px-5 md:py-3.5">{verifiedBadge(user)}</td>
                    <td className="px-4 py-3 md:px-5 md:py-3.5">{newsletterBadge(user)}</td>
                    <td className="px-4 py-3 md:px-5 md:py-3.5 hidden xl:table-cell">
                      <span className="text-xs text-white/60">
                        {new Date(user.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <DropdownMenu
                        open={openMenuUserId === user._id}
                        onOpenChange={(open) =>
                          setOpenMenuUserId(open ? user._id : null)
                        }
                      >
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gold-primary/20 text-gold-primary transition-colors hover:bg-gold-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60"
                            aria-label="User actions"
                            disabled={isBusy}
                          >
                            <HiDotsHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 border border-gold-primary/20 bg-black text-white/80 shadow-xl"
                        >
                          <DropdownMenuItem
                            className="cursor-pointer text-sm hover:text-gold-primary"
                            onSelect={(event) => {
                              event.preventDefault();
                              handleEdit(user);
                              setOpenMenuUserId(null);
                            }}
                            disabled={isBusy}
                          >
                            <FaEdit className="h-3.5 w-3.5 text-gold-primary" />
                            Edit details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-sm hover:text-gold-primary"
                            onSelect={(event) => {
                              event.preventDefault();
                              handleOpenStatusToggle(user);
                              setOpenMenuUserId(null);
                            }}
                            disabled={isBusy}
                          >
                            {user.isActive ? (
                              <>
                                <FaUserSlash className="h-3.5 w-3.5 text-red-400" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <FaCheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-sm hover:text-gold-primary"
                            onSelect={(event) => {
                              event.preventDefault();
                              handleOpenResetPassword(user);
                              setOpenMenuUserId(null);
                            }}
                            disabled={isBusy}
                          >
                            <FaKey className="h-3.5 w-3.5 text-sky-400" />
                            Reset password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gold-primary/20" />
                          <DropdownMenuItem
                            className="cursor-pointer text-sm text-red-400 focus:bg-red-500/10 focus:text-red-300"
                            onSelect={(event) => {
                              event.preventDefault();
                              handleOpenDelete(user);
                              setOpenMenuUserId(null);
                            }}
                            disabled={isBusy}
                            variant="destructive"
                          >
                            <FaTrash className="h-3.5 w-3.5" />
                            Delete user
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {totalPages > 1 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1 || isLoading}
            variant="outline"
            size="md"
          >
            Previous
          </Button>
          <p className="text-white/60 text-sm font-light text-center">
            Page{" "}
            <span className="text-gold-primary font-semibold">{page}</span> of{" "}
            <span className="text-gold-primary font-semibold">{totalPages}</span>
          </p>
          <Button
            onClick={() =>
              setPage((prev) => (prev >= totalPages ? prev : prev + 1))
            }
            disabled={page >= totalPages || isLoading}
            variant="outline"
            size="md"
          >
            Next
          </Button>
        </div>
      )}

      <UserFormModal
        isOpen={isFormOpen}
        mode={formMode}
        user={selectedUser}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitUser}
      />

      <ResetPasswordModal
        isOpen={isResetModalOpen}
        userName={
          userToReset
            ? `${userToReset.firstName} ${userToReset.lastName}`.trim()
            : undefined
        }
        isSubmitting={resetPasswordMutation.isPending}
        onClose={() => {
          setIsResetModalOpen(false);
          setUserToReset(null);
        }}
        onSubmit={handleResetPassword}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={
          userToDelete
            ? `Are you sure you want to delete ${userToDelete.firstName} ${userToDelete.lastName}? This action cannot be undone.`
            : "Are you sure you want to delete this user? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />

      <ConfirmationModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setUserToToggle(null);
        }}
        onConfirm={handleConfirmStatusToggle}
        title={userToToggle?.isActive ? "Deactivate User" : "Activate User"}
        message={
          userToToggle
            ? `Are you sure you want to ${userToToggle.isActive ? "deactivate" : "activate"
            } ${userToToggle.firstName} ${userToToggle.lastName}?`
            : "Update user status?"
        }
        confirmText={userToToggle?.isActive ? "Deactivate" : "Activate"}
        cancelText="Cancel"
        variant={userToToggle?.isActive ? "warning" : "info"}
        isLoading={toggleStatusMutation.isPending}
      />
    </div>
  );
};

export default Users;
