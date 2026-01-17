function base64ToArrayBuffer(base64) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function bin2String(array) {
  var result = "";
  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(array[i]);
  }
  return result;
}

// Helper function to decode Base64 to a string
function base64ToString(base64) {
  return atob(base64); // decode base64 to a binary string
}

// Function to convert device info fields into readable format
function converBase64Obj(deviceInfo) {
  if (!deviceInfo) return null;

  // Decode IP address from base64
  const decodedDeviceInfo = {
    ...deviceInfo,
    deviceStatus: {
      ...deviceInfo.deviceStatus,
      connectionInfo: {
        ...deviceInfo.deviceStatus.connectionInfo,
        // Decode ip4Addr if exists
        ip4Addr: deviceInfo.deviceStatus.connectionInfo?.ip4Addr
          ? decodeIpFromBase64(deviceInfo.deviceStatus.connectionInfo.ip4Addr)
          : undefined,
      },
      provisioningInfo: {
        ...deviceInfo.deviceStatus.provisioningInfo,
        // Decode ssid and bssid if they exist
        ssid: deviceInfo.deviceStatus.provisioningInfo?.ssid
          ? base64ToString(deviceInfo.deviceStatus.provisioningInfo.ssid)
          : undefined,
        bssid: deviceInfo.deviceStatus.provisioningInfo?.bssid
          ? base64ToString(deviceInfo.deviceStatus.provisioningInfo.bssid)
          : undefined,
      },
    },
  };

  return decodedDeviceInfo;
}

// Helper function to decode IP address
function decodeIpFromBase64(base64) {
  const bytes = new Uint8Array(
    atob(base64)
      .split("")
      .map((c) => c.charCodeAt(0))
  );
  return `${bytes[0]}.${bytes[1]}.${bytes[2]}.${bytes[3]}`;
}

export { base64ToArrayBuffer, bin2String, decodeIpFromBase64, converBase64Obj };
