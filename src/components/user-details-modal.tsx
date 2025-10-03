"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR");
}

function formatPhone(phone: string): string {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
}

function parseTrackingData(message: string) {
  try {
    const trackingMatch = message.match(/Dados de tracking:\{([^}]+)\}/);
    if (trackingMatch) {
      const trackingDataStr = `{${trackingMatch[1]}}`;
      const trackingData = JSON.parse(trackingDataStr.replace(/(\w+):/g, '"$1":'));
      return {
        originalMessage: message.replace(/Dados de tracking:\{[^}]+\}/, '').trim(),
        trackingData
      };
    }
    return { originalMessage: message, trackingData: null };
  } catch {
    return { originalMessage: message, trackingData: null };
  }
}

export function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  if (!user) return null;

  const { originalMessage, trackingData } = parseTrackingData(user.message);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ❌
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Telefone</h3>
                <p className="text-sm">{formatPhone(user.phone)}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Cargo</h3>
                <p className="text-sm">{user.position}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Data de Nascimento</h3>
                <p className="text-sm">{formatDate(user.birthDate)}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Cadastrado em</h3>
                <p className="text-sm">{formatDate(user.createdAt)}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">Mensagem</h3>
              <p className="text-sm bg-gray-50 p-3 rounded-md">{originalMessage}</p>
            </div>
            
            {trackingData && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Dados de Rastreamento</h3>
                  <div className="bg-gray-50 p-3 rounded-md text-sm space-y-2">
                    <div>
                      <strong>Referrer:</strong> {trackingData.referrer}
                    </div>
                    <div>
                      <strong>Timestamp:</strong> {new Date(trackingData.timestamp).toLocaleString("pt-BR")}
                    </div>
                    <div>
                      <strong>Session ID:</strong> {trackingData.sessionId}
                    </div>
                  </div>
                </div>
              </>
            )}
            
            <Separator />
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
              <Button>
                ✏️ Editar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}