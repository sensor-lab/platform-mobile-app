import { ESPDevice, ESPSecurity, ESPTransport } from '@orbital-systems/react-native-esp-idf-provisioning';
import { checkAndRequestPermission } from '../hooks/usePermission';

class ApConnectInstance {
  device: ESPDevice;
  ssid: string;

  constructor(ssid: string) {
    this.ssid = ssid;
    this.device = new ESPDevice({
      name: ssid,
      transport: ESPTransport.softap,
      security: ESPSecurity.unsecure,
    });
  }

  connect = async (password: string): Promise<boolean> => {
    try {
      const hasPermission = await checkAndRequestPermission('wifi');
      if (!hasPermission) {
        console.log('failed to request permission');
        return false;
      }

      await this.device.connect('', password);
      return true;
    } catch (e) {
      console.log(`provision start error: ${e}`);
      if (e instanceof Error) {
        console.log('message:', e.message);
        console.log('stack:', e.stack);
      }
      return false;
    }
  };

  disconnect = async (): Promise<void> => {
    try {
      this.device.disconnect();
    } catch (e) {
      console.log(`provision wifi disconnect error: ${e}`);
      if (e instanceof Error) {
        console.log('message:', e.message);
        console.log('stack:', e.stack);
      }
    }
  };
}

export const createApConnectService = (ssid: string) => new ApConnectInstance(ssid);
