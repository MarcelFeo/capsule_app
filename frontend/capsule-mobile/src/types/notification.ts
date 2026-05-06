export interface NotificationResponse {
  id: number;
  usuario_id: number;
  mensagem: string;
  tipo?: string | null;
  prioridade?: string; // 'ALTA', 'NORMAL', 'BAIXA'
  referencia_tipo?: string | null;
  referencia_id?: number | null;
  data_envio?: string;
  data_leitura?: string | null;
  lida: boolean;
}

export interface NotificationUpdate {
  lida?: boolean;
  data_leitura?: string | null;
}