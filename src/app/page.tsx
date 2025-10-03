"use client"

import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

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

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalUsers = users.length;
  const recentUsers = users.filter(user => {
    const createdAt = new Date(user.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;
  
  const positionStats = users.reduce((acc, user) => {
    acc[user.position] = (acc[user.position] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topPositions = Object.entries(positionStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const recentUsersData = users
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Dashboard" />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Bem-vindo ao Painel Administrativo</h1>
              <p className="text-muted-foreground">
                {currentTime.toLocaleDateString('pt-BR', { 
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })} • {currentTime.toLocaleTimeString('pt-BR')}
              </p>
            </div>
          
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Usuários
                </CardTitle>
                <span className="text-lg">👥</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : totalUsers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {recentUsers} novos esta semana
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cargos Únicos
                </CardTitle>
                <span className="text-lg">�</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : Object.keys(positionStats).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Diferentes posições cadastradas
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Distribuição por Cargos</CardTitle>
                <CardDescription>
                  Análise da distribuição de usuários por posição
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topPositions.map(([position, count], index) => {
                      const percentage = Math.round((count / totalUsers) * 100);
                      return (
                        <div key={position} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">#{index + 1}</span>
                              <Badge variant="secondary">{position}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {count} usuários ({percentage}%)
                            </div>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                    {topPositions.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        Nenhum dado disponível
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Usuários Recentes</CardTitle>
                <CardDescription>
                  Últimos usuários cadastrados no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentUsersData.map((user) => {
                      const timeAgo = Math.floor(
                        (new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
                      );
                      return (
                        <div key={user.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {user.position}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {timeAgo === 0 ? 'Hoje' : `${timeAgo}d atrás`}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {recentUsersData.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">
                        Nenhum usuário cadastrado
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Acesso rápido às principais funcionalidades do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <span className="text-2xl">👤</span>
                  <span>Gerenciar Usuários</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <span className="text-2xl">📊</span>
                  <span>Relatórios</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <span className="text-2xl">⚙️</span>
                  <span>Configurações</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <span className="text-2xl">🔧</span>
                  <span>Ferramentas</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}