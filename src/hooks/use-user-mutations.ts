import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiUrl, API_ENDPOINTS } from "@/lib/api";

interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  position: string;
  birthDate: string;
  message: string;
}

interface UpdateUserData extends CreateUserData {
  id: number;
}

async function createUser(userData: CreateUserData) {
  const response = await fetch(apiUrl(API_ENDPOINTS.USERS), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar usuário");
  }

  return response.json();
}

async function updateUser(userData: UpdateUserData) {
  const { id, ...data } = userData;
  const response = await fetch(apiUrl(API_ENDPOINTS.USER_BY_ID(id)), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar usuário");
  }

  return response.json();
}

async function deleteUser(id: number) {
  const response = await fetch(apiUrl(API_ENDPOINTS.USER_BY_ID(id)), {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao deletar usuário");
  }

  return response.json();
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}