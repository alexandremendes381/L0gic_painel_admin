"use client"

import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { UserDetailsModal } from "@/components/user-details-modal";
import { UserFormModal } from "@/components/user-form-modal";
import { DeleteUserModal } from "@/components/delete-user-modal";
import { useState } from "react";
import { apiUrl, API_ENDPOINTS } from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  birthDate: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch(apiUrl(API_ENDPOINTS.USERS));
  if (!response.ok) {
    throw new Error("Erro ao buscar usuários");
  }
  return response.json();
}

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const filteredUsers = users.filter(user => {
    const matchesName = nameFilter === "" || user.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesEmail = emailFilter === "" || user.email.toLowerCase().includes(emailFilter.toLowerCase());
    return matchesName && matchesEmail;
  });

  return (
    <div className="flex flex-col">
      <Header title="Usuários" />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="space-y-4 md:space-y-6">
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8 text-red-500">
              Erro ao carregar usuários: {error.message}
            </div>
          )}
          
          {!isLoading && !error && (
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button size="sm" onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
                  ➕ Novo Usuário
                </Button>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  🔍 Filtros
                </Button>
              </div>
              
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="relative flex-1 sm:flex-none">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    �
                  </span>
                  <input
                    type="text"
                    placeholder="Filtrar por nome..."
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="w-full sm:w-48 pl-8 pr-4 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="relative flex-1 sm:flex-none">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    ✉️
                  </span>
                  <input
                    type="text"
                    placeholder="Filtrar por email..."
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value)}
                    className="w-full sm:w-48 pl-8 pr-4 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                {(nameFilter || emailFilter) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setNameFilter("");
                      setEmailFilter("");
                    }}
                    className="flex items-center gap-1"
                  >
                    🧹 Limpar
                  </Button>
                )}
              </div>
            </div>
          )}

          {!isLoading && !error && (
            <>
              <Card className="hidden md:block">
                <CardHeader>
                  <CardTitle>Lista de Usuários</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-medium">Nome</th>
                          <th className="text-left py-2 px-3 font-medium">Email</th>
                          <th className="text-left py-2 px-3 font-medium">Cargo</th>
                          <th className="text-left py-2 px-3 font-medium">Criado em</th>
                          <th className="text-left py-2 px-3 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-muted/50">
                              <td className="py-2 px-3">
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">{user.name}</span>
                                  <span className="text-xs text-muted-foreground">{user.phone}</span>
                                </div>
                              </td>
                              <td className="py-2 px-3 text-sm text-muted-foreground">{user.email}</td>
                              <td className="py-2 px-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                                  {user.position}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-xs text-muted-foreground">
                                {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)} title="Ver detalhes" className="h-7 w-7 p-0">
                                    👁️
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => setUserToEdit(user)} title="Editar usuário" className="h-7 w-7 p-0">
                                    ✏️
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-destructive h-7 w-7 p-0"
                                    onClick={() => setUserToDelete({ id: user.id, name: user.name })}
                                    title="Excluir usuário"
                                  >
                                    🗑️
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-muted-foreground">
                              {(nameFilter || emailFilter) ? (
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-2xl">🔍</span>
                                  <p>Nenhum usuário encontrado</p>
                                  <p className="text-sm">Tente ajustar os filtros aplicados</p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-2xl">👥</span>
                                  <p>Nenhum usuário cadastrado</p>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="md:hidden space-y-3">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <Card key={user.id} className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-base">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)} title="Ver detalhes" className="h-7 w-7 p-0">
                              👁️
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setUserToEdit(user)} title="Editar usuário" className="h-7 w-7 p-0">
                              ✏️
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive h-7 w-7 p-0"
                              onClick={() => setUserToDelete({ id: user.id, name: user.name })}
                              title="Excluir usuário"
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Telefone</span>
                            <span className="text-sm">{user.phone}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Cargo</span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground w-fit">
                              {user.position}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Criado em</span>
                            <span className="text-sm">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-6">
                    <div className="text-center text-muted-foreground">
                      {(nameFilter || emailFilter) ? (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-4xl">🔍</span>
                          <p className="text-lg">Nenhum usuário encontrado</p>
                          <p className="text-sm">com os filtros aplicados</p>
                          <p className="text-xs">Tente ajustar os filtros</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-4xl">👥</span>
                          <p className="text-lg">Nenhum usuário cadastrado</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </>
          )}

          {!isLoading && !error && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                Mostrando {filteredUsers.length} de {users.length} usuários
                {(nameFilter || emailFilter) && (
                  <span className="block sm:inline sm:ml-2 text-primary">
                    • Filtros: {nameFilter && `Nome: "${nameFilter}"`}{nameFilter && emailFilter && ', '}{emailFilter && `Email: "${emailFilter}"`}
                  </span>
                )}
              </p>
              <div className="flex items-center justify-center gap-2 sm:justify-end">
                <Button variant="outline" size="sm" disabled className="flex-1 sm:flex-none">
                  ⬅️ Anterior
                </Button>
                <Button variant="outline" size="sm" disabled className="flex-1 sm:flex-none">
                  ➡️ Próximo
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <UserDetailsModal 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)} 
      />
      
      <UserFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      
      <UserFormModal
        user={userToEdit}
        isOpen={Boolean(userToEdit)}
        onClose={() => setUserToEdit(null)}
      />
      
      <DeleteUserModal
        user={userToDelete}
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
      />
    </div>
  );
}