import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/services/api";

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
  const response = await API.post("/api/users", userData);

  if (response.status >= 400) {
    throw new Error("Erro ao criar usuário");
  }

  return response.data;
}

async function updateUser(userData: UpdateUserData) {
  const { id, ...data } = userData;
  const response = await API.put(`/api/users/${id}`, data);

  if (response.status >= 400) {
    throw new Error("Erro ao atualizar usuário");
  }

  return response.data;
}

async function deleteUser(id: number) {
  const response = await API.delete(`/api/users/${id}`);

  if (response.status >= 400) {
    throw new Error("Erro ao deletar usuário");
  }

  return response.data;
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