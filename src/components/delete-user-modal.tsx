"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDeleteUser } from "@/hooks/use-user-mutations"

interface DeleteUserModalProps {
  user: { id: number; name: string } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteUserModal({ user, isOpen, onClose }: DeleteUserModalProps) {
  const deleteUserMutation = useDeleteUser();

  const handleDelete = async () => {
    if (!user) return;

    try {
      await deleteUserMutation.mutateAsync(user.id);
      onClose();
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md m-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-red-600">
                  🗑️ Deletar Usuário
                </CardTitle>
                <CardDescription>
                  Esta ação não pode ser desfeita
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ❌
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Tem certeza que deseja deletar o usuário <strong>{user.name}</strong>?
            </p>

            {deleteUserMutation.error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {deleteUserMutation.error.message}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? "Deletando..." : "🗑️ Deletar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}