"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MdClose, MdEdit } from "react-icons/md"
import { formatDateSafe, formatPhoneSafe } from "@/lib/date-utils"

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
      <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 border border-border">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <MdClose size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Telefone</h3>
                <p className="text-sm">{formatPhoneSafe(user.phone)}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Cargo</h3>
                <p className="text-sm">{user.position}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Data de Nascimento</h3>
                <p className="text-sm">{formatDateSafe(user.birthDate)}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Cadastrado em</h3>
                <p className="text-sm">{formatDateSafe(user.createdAt)}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">Mensagem</h3>
              <p className="text-sm bg-muted/50 text-foreground p-3 rounded-md border">{originalMessage}</p>
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
                      <strong>Timestamp:</strong> {formatDateSafe(trackingData.timestamp)}
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
                <MdEdit size={16} className="mr-1" />
                Editar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}