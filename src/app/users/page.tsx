"use client"

import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { UserDetailsModal } from "@/components/user-details-modal";
import { UserFormModal } from "@/components/user-form-modal";
import { DeleteUserModal } from "@/components/delete-user-modal";
import { useState } from "react";

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
  const response = await fetch("http://localhost:3001/api/users");
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
  const [searchFilter, setSearchFilter] = useState("");
  
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    user.email.toLowerCase().includes(searchFilter.toLowerCase())
  );

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
              
              <div className="flex items-center gap-2">
                <div className="relative flex-1 md:flex-none">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Pesquisar por nome ou email..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full md:w-80 pl-8 pr-4 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
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
                          <th className="text-left py-3 px-4 font-medium">Nome</th>
                          <th className="text-left py-3 px-4 font-medium">Email</th>
                          <th className="text-left py-3 px-4 font-medium">Telefone</th>
                          <th className="text-left py-3 px-4 font-medium">Cargo</th>
                          <th className="text-left py-3 px-4 font-medium">Data Nascimento</th>
                          <th className="text-left py-3 px-4 font-medium">Mensagem</th>
                          <th className="text-left py-3 px-4 font-medium">Criado em</th>
                          <th className="text-left py-3 px-4 font-medium">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4 font-medium">{user.name}</td>
                              <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                              <td className="py-3 px-4">{user.phone}</td>
                              <td className="py-3 px-4">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                                  {user.position}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm">{new Date(user.birthDate).toLocaleDateString('pt-BR')}</td>
                              <td className="py-3 px-4 text-sm max-w-[200px] truncate" title={user.message}>
                                {user.message}
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">
                                {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)} title="Ver detalhes">
                                    👁️
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => setUserToEdit(user)} title="Editar usuário">
                                    ✏️
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-destructive"
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
                            <td colSpan={8} className="py-8 text-center text-muted-foreground">
                              {searchFilter ? (
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-2xl">🔍</span>
                                  <p>Nenhum usuário encontrado para &quot;{searchFilter}&quot;</p>
                                  <p className="text-sm">Tente buscar por outro nome ou e-mail</p>
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

              <div className="md:hidden space-y-4">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <Card key={user.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-lg">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)} title="Ver detalhes">
                              👁️
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setUserToEdit(user)} title="Editar usuário">
                              ✏️
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive"
                              onClick={() => setUserToDelete({ id: user.id, name: user.name })}
                              title="Excluir usuário"
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Telefone:</span>
                            <span>{user.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cargo:</span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                              {user.position}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Nascimento:</span>
                            <span>{new Date(user.birthDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Criado em:</span>
                            <span>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                          {user.message && (
                            <div className="flex flex-col gap-1">
                              <span className="text-muted-foreground">Mensagem:</span>
                              <p className="text-xs bg-muted p-2 rounded">{user.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-8">
                    <div className="text-center text-muted-foreground">
                      {searchFilter ? (
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-4xl">🔍</span>
                          <p className="text-lg">Nenhum usuário encontrado</p>
                          <p className="text-sm">para &quot;{searchFilter}&quot;</p>
                          <p className="text-xs">Tente buscar por outro nome ou e-mail</p>
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
                {searchFilter && (
                  <span className="block sm:inline sm:ml-2 text-primary">
                    • Filtrado por: &quot;{searchFilter}&quot;
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