"use client"

import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
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

export default function ReportsPage() {
  const [isExporting, setIsExporting] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const exportToCSV = () => {
    setIsExporting(true);
    
    try {
      const headers = [
        'ID',
        'Nome',
        'Email', 
        'Telefone',
        'Cargo',
        'Data de Nascimento',
        'Mensagem',
        'Data de Cadastro',
        'Última Atualização'
      ];

      const csvContent = [
        headers.join(','),
        ...users.map(user => [
          user.id,
          `"${user.name}"`,
          user.email,
          user.phone,
          `"${user.position}"`,
          new Date(user.birthDate).toLocaleDateString('pt-BR'),
          `"${user.message.replace(/"/g, '""')}"`,
          new Date(user.createdAt).toLocaleDateString('pt-BR'),
          new Date(user.updatedAt).toLocaleDateString('pt-BR')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = () => {
    setIsExporting(true);
    
    try {
      const excelContent = `
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Cargo</th>
              <th>Data de Nascimento</th>
              <th>Mensagem</th>
              <th>Data de Cadastro</th>
              <th>Última Atualização</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(user => `
              <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.position}</td>
                <td>${new Date(user.birthDate).toLocaleDateString('pt-BR')}</td>
                <td>${user.message}</td>
                <td>${new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>${new Date(user.updatedAt).toLocaleDateString('pt-BR')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      const blob = new Blob([excelContent], { 
        type: 'application/vnd.ms-excel;charset=utf-8;' 
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.xls`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Relatórios" />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Exportação de Leads</h1>
              <p className="text-muted-foreground">
                Exporte todos os leads cadastrados em formato CSV ou Excel
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  📊 Exportar Leads
                </CardTitle>
                <CardDescription>
                  Faça o download de todos os leads em formato CSV ou Excel para análise externa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">{users.length}</div>
                        <div className="text-sm text-muted-foreground">Total de Leads</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          {Array.from(new Set(users.map(user => user.position))).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Cargos Únicos</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="font-semibold">📋 Dados incluídos na exportação:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      ID do Lead
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Nome Completo
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Email
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Telefone
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Cargo/Posição
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Data de Nascimento
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Mensagem
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Data de Cadastro
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">💾 Escolha o formato:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={exportToCSV}
                      disabled={isExporting || isLoading || users.length === 0}
                      className="h-16 flex flex-col gap-1"
                      variant="outline"
                    >
                      <span className="text-lg">📄</span>
                      <span>Exportar CSV</span>
                      <span className="text-xs text-muted-foreground">
                        Compatível com Excel, Google Sheets
                      </span>
                    </Button>

                    <Button
                      onClick={exportToExcel}
                      disabled={isExporting || isLoading || users.length === 0}
                      className="h-16 flex flex-col gap-1"
                      variant="outline"
                    >
                      <span className="text-lg">📊</span>
                      <span>Exportar Excel</span>
                      <span className="text-xs text-muted-foreground">
                        Formato .xls para Microsoft Excel
                      </span>
                    </Button>
                  </div>
                </div>

                {isExporting && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Preparando arquivo para download...</p>
                  </div>
                )}

                {users.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-muted-foreground">
                    <span className="text-4xl mb-2 block">📋</span>
                    <p>Nenhum lead encontrado para exportar</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}