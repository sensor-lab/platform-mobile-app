import { ESPDevice, ESPSecurity, ESPTransport } from '@orbital-systems/react-native-esp-idf-provisioning';

class ProvisionServiceInstance {
  device: ESPDevice;
  dev_id: string;

  constructor() {
    this.dev_id = ""
    this.device = new ESPDevice({
      name: 'PROV_SENSORSPARKS',
      transport: ESPTransport.softap,
      security: ESPSecurity.secure,
    });
  }

  connect = async() => {
    try {
      // Connect to device with proofOfPossession
      const proofOfPossession = 'uefj9382';
      await this.device.connect(proofOfPossession);
      const resp = await this.device.sendData("dev-id", "--")
      console.log(`get device ID: ${resp}`)
      this.dev_id = resp
    } catch (e) {
      console.log(`provision start error: ${e}`)
      if (e instanceof Error) {
        console.log('message:', e.message);
        console.log('stack:', e.stack);
      }
    }
  }

  devId = async(): Promise<string> => {
    return this.dev_id
  }

  listWiFi = async() => {
    try {
       // Get wifi list
      const wifiList = await this.device.scanWifiList();
      console.log(`wifi list: ${JSON.stringify(wifiList)}`)
      return wifiList;
    } catch (e) {
      console.log(`list wifi error: ${e}`)
      if (e instanceof Error) {
        console.log('message:', e.message);
        console.log('stack:', e.stack);
      }

      return [];
    }
  }

  ssidConnect = async(ssid: string, passphrase: string): Promise<string> => {
    try {
      console.log(`connect ${ssid} with ${passphrase}`)
      const result = await this.device.provision(ssid, passphrase)
      return result.status
    } catch (e) {
      console.log(`router ssid connect error: ${e}`)
      if (e instanceof Error) {
        console.log('message:', e.message);
        console.log('stack:', e.stack);
        return e.message
      }
      return "unknown error"
    }
  }

  getDevId = (): string => {
    return this.dev_id
  }

  setupAccessPoint = async(ssid: string, passphrase: string): Promise<string> => {
    try {
      const payload = {
        "ssid": ssid,
        "pass": passphrase
      }
      const result = await this.device.sendData("provision-ap", JSON.stringify(payload))
      return result
    } catch (e) {
      console.log(`router ssid connect error: ${e}`)
      if (e instanceof Error) {
        console.log('message:', e.message);
        console.log('stack:', e.stack);
        return e.message
      }
      return "error"
    }
  }

  disconnect = async() => {
    try {
      this.device.disconnect();
    } catch (e) {
      console.log(`provision wifi disconnect error: ${e}`)
      if (e instanceof Error) {
        console.log('message:', e.message);
        console.log('stack:', e.stack);
      }
    }
  }
}

export const ProvisionService = new ProvisionServiceInstance();
