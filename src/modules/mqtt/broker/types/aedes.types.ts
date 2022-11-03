import { Client } from 'aedes';

export interface IpClient extends Client {
  ip: string;
  eventAt: Date;
  connDetails?;
}
