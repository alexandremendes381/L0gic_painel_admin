"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCreateUser, useUpdateUser } from "@/hooks/use-user-mutations"

interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  birthDate: string;
  message: string;
}

interface UserFormModalProps {
  user?: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserFormModal({ user, isOpen, onClose }: UserFormModalProps) {
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    phone: "",
    position: "",
    birthDate: "",
    message: "",
  });

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          position: user.position || "",
          birthDate: user.birthDate || "",
          message: user.message || "",
        });
      } else {
        setFormData({
          name: "",
          email: "",
          phone: "",
          position: "",
          birthDate: "",
          message: "",
        });
      }
    }
  }, [user, isOpen]);

  const isEditing = Boolean(user?.id);
  const isLoading = createUserMutation.isPending || updateUserMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && user?.id) {
        await updateUserMutation.mutateAsync({ ...formData, id: user.id });
      } else {
        await createUserMutation.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      position: "",
      birthDate: "",
      message: "",
    });
    onClose();
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 border border-border">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  {isEditing ? "Editar Usuário" : "Novo Usuário"}
                </CardTitle>
                <CardDescription>
                  {isEditing ? "Atualize as informações do usuário" : "Preencha os dados do novo usuário"}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <div className="w-4 h-4 flex items-center justify-center text-sm font-bold">×</div>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nome *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Telefone *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium mb-1">
                    Cargo *
                  </label>
                  <input
                    id="position"
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleInputChange("position", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="birthDate" className="block text-sm font-medium mb-1">
                    Data de Nascimento *
                  </label>
                  <input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background resize-none"
                    required
                  />
                </div>
              </div>

              {(createUserMutation.error || updateUserMutation.error) && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                  {createUserMutation.error?.message || updateUserMutation.error?.message}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}