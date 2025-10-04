"use client"

import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserDetailsModal } from "@/components/user-details-modal";
import { UserFormModal } from "@/components/user-form-modal";
import { DeleteUserModal } from "@/components/delete-user-modal";
import { useState, useEffect } from "react";
import { z } from "zod";
import API from "@/services/api";
import useAuth from "@/hooks/useAuth";
import { formatDateSafe } from "@/lib/date-utils";
import { 
  MdVisibility, 
  MdEdit, 
  MdDelete,
  MdChevronLeft,
  MdChevronRight,
  MdPeople,
  MdSearch,
  MdAdd,
  MdClear
} from "react-icons/md";

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

const searchSchema = z.string().regex(/^[\w\s@.]*$/, "Campo inválido"); // aceita letras, números, espaços, @ e .

export default function UsersPage() {
  useAuth(); // protege a rota
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const fetchUsers = async (q?: string) => {
    setLoading(true);
    try {
      const res = q
        ? await API.get(`/api/users/search?q=${encodeURIComponent(q)}`)
        : await API.get("/api/users");
      setUsers(res.data || []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const parseResult = searchSchema.safeParse(query);
    if (!parseResult.success) {
      setSearchError(parseResult.error.issues[0].message);
      return;
    } else {
      setSearchError("");
    }

    const delayDebounce = setTimeout(() => {
      fetchUsers(query || undefined);
    }, 300); // debounce simples

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="flex flex-col">
      <Header title="Usuários" />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button size="sm" onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
                <MdAdd size={16} className="mr-1" />
                Novo Usuário
              </Button>
            </div>
            
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="relative flex-1 sm:flex-none">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <MdSearch size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Pesquisar por nome ou e-mail"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full sm:w-64 pl-8 pr-4 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              {query && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setQuery("")}
                  className="flex items-center gap-1"
                >
                  <MdClear size={16} className="mr-1" />
                  Limpar
                </Button>
              )}
            </div>
          </div>
          
          {searchError && (
            <p className="text-red-500 text-sm">{searchError}</p>
          )}

          <div className="relative">
            {loading && (
              <div className="absolute top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-10 flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            
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
                        {users.length > 0 ? (
                          users.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-muted/50">
                              <td className="py-2 px-3">
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">{user.name}</span>
                                  <span className="text-xs text-muted-foreground">{user.phone}</span>
                                </div>
                              </td>
                              <td className="py-2 px-3 text-sm text-muted-foreground max-w-[200px]">
                                <span className="truncate block">{user.email}</span>
                              </td>
                              <td className="py-2 px-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                                  {user.position}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-xs text-muted-foreground">
                                {formatDateSafe(user.createdAt)}
                              </td>
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)} title="Ver detalhes" className="h-7 w-7 p-0">
                                    <MdVisibility size={12} />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => setUserToEdit(user)} title="Editar usuário" className="h-7 w-7 p-0">
                                    <MdEdit size={12} />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-destructive h-7 w-7 p-0"
                                    onClick={() => setUserToDelete({ id: user.id, name: user.name })}
                                    title="Excluir usuário"
                                  >
                                    <MdDelete size={12} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-muted-foreground">
                              {query ? (
                                <div className="flex flex-col items-center gap-2">
                                  <MdSearch size={48} className="text-muted-foreground" />
                                  <p>Nenhum usuário encontrado</p>
                                  <p className="text-sm">Tente ajustar o termo de busca</p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <MdPeople size={48} className="text-muted-foreground" />
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
                {users.length > 0 ? (
                  users.map((user) => (
                    <Card key={user.id} className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 pr-2">
                            <h3 className="font-medium text-base truncate">{user.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)} title="Ver detalhes" className="h-7 w-7 p-0">
                              <MdVisibility size={12} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setUserToEdit(user)} title="Editar usuário" className="h-7 w-7 p-0">
                              <MdEdit size={12} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive h-7 w-7 p-0"
                              onClick={() => setUserToDelete({ id: user.id, name: user.name })}
                              title="Excluir usuário"
                            >
                              <MdDelete size={12} />
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
                            <span className="text-sm">{formatDateSafe(user.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-6">
                    <div className="text-center text-muted-foreground">
                      {query ? (
                        <div className="flex flex-col items-center gap-2">
                          <MdSearch size={64} className="text-muted-foreground" />
                          <p className="text-lg">Nenhum usuário encontrado</p>
                          <p className="text-sm">com o termo de busca</p>
                          <p className="text-xs">Tente outras palavras-chave</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <MdPeople size={64} className="text-muted-foreground" />
                          <p className="text-lg">Nenhum usuário cadastrado</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              Mostrando {users.length} usuários
              {query && (
                <span className="block sm:inline sm:ml-2 text-primary">
                  • Busca: &quot;{query}&quot;
                </span>
              )}
            </p>
            <div className="flex items-center justify-center gap-2 sm:justify-end">
              <Button variant="outline" size="sm" disabled className="flex-1 sm:flex-none">
                <MdChevronLeft size={16} className="mr-1" />
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled className="flex-1 sm:flex-none">
                Próximo
                <MdChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
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