import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      <Header title="Configurações" />
      
      <div className="flex-1 p-6">
        <div className="grid gap-6 max-w-4xl">

          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Gerencie as configurações básicas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="site-name" className="text-sm font-medium">
                  Nome do Site
                </label>
                <input
                  id="site-name"
                  type="text"
                  defaultValue="Admin Panel - L0gic"
                  className="px-3 py-2 text-sm border border-input rounded-md bg-background"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="site-description" className="text-sm font-medium">
                  Descrição do Site
                </label>
                <textarea
                  id="site-description"
                  rows={3}
                  defaultValue="Painel administrativo para gerenciamento do sistema"
                  className="px-3 py-2 text-sm border border-input rounded-md bg-background resize-none"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  id="maintenance-mode"
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
                />
                <label htmlFor="maintenance-mode" className="text-sm font-medium">
                  Modo de Manutenção
                </label>
              </div>
              
              <Button>Salvar Alterações</Button>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>
                Configure como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Notificações por Email</div>
                  <div className="text-xs text-muted-foreground">
                    Receba notificações importantes por email
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-input"
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Notificações Push</div>
                  <div className="text-xs text-muted-foreground">
                    Receba notificações em tempo real no navegador
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-input"
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Relatórios Semanais</div>
                  <div className="text-xs text-muted-foreground">
                    Receba um resumo semanal das atividades
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input"
                />
              </div>
              
              <Button>Atualizar Preferências</Button>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Gerencie suas configurações de segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Alterar Senha
                </label>
                <div className="grid gap-2">
                  <input
                    type="password"
                    placeholder="Senha atual"
                    className="px-3 py-2 text-sm border border-input rounded-md bg-background"
                  />
                  <input
                    type="password"
                    placeholder="Nova senha"
                    className="px-3 py-2 text-sm border border-input rounded-md bg-background"
                  />
                  <input
                    type="password"
                    placeholder="Confirmar nova senha"
                    className="px-3 py-2 text-sm border border-input rounded-md bg-background"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Autenticação de Dois Fatores</div>
                  <div className="text-xs text-muted-foreground">
                    Adicione uma camada extra de segurança à sua conta
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
              
              <Button>Salvar Alterações de Segurança</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}