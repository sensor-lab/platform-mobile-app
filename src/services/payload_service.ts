// @ts-ignore
import { encode as b64encode } from "base-64";
import { Buffer } from "buffer";
import * as flatbuffers from "flatbuffers";
import "react-native-get-random-values";
import WebSocketWithSelfSignedCert from "react-native-websocket-self-signed";
import { v4 as uuidv4 } from "uuid";
import {
  FlatbuffersCommand,
  FlatbuffersEnvelope,
  FlatbuffersMessageOptions,
  FlatbuffersSubscribe,
  FlatbuffersUnsubscribe,
  Message,
} from "./flatbuffersmsg";

enum CommandType {
  HardwareOperation = 900,
  StatusQuery = 910,
  ConfigQuery = 920,
}

enum TopicType {
  TOPIC_TYPE_NORMAL = 0,
  TOPIC_TYPE_EPHEMERAL = 3,
  TOPIC_TYPE_EPHEMERAL_TOPIC = 6,
}

type PendingRequest = {
  resolve: (data: Uint8Array) => void;
  reject: (err: Error) => void;
  timeout: ReturnType<typeof setTimeout>;
};

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return b64encode(binary);
}

function base64ToUint8(str: string): Uint8Array {
  return Uint8Array.from(Buffer.from(str, "base64"));
}

class WebsocketService {
  private txid: string;
  private qos = 50;
  private deviceType = "";
  private devicePrincipal = "";
  private responseSubscribed = [];
  private token = "";
  private signature = "";
  private url: string;
  private ws: WebSocketWithSelfSignedCert;
  private pending = new Map<string, PendingRequest>();

  constructor(url: string) {
    this.url = url;
    this.txid = uuidv4();
    this.ws = WebSocketWithSelfSignedCert.getInstance(this.url);
    this.ws.onBinaryMessage(this.handleBinaryMessage);
    this.ws.onClose(() => {
      console.log("websocket closed!");
    });
    this.ws.onOpen(() => {
      console.log("websocket opened!");
    });
    this.ws.onError(() => {
      console.log("websocket error!");
    });
    console.log(`websocket txid: ${this.txid}`);
  }

  private handleBinaryMessage = (data: string): void => {
    const bb = new flatbuffers.ByteBuffer(base64ToUint8(data));
    const envelope = FlatbuffersEnvelope.getRootAsFlatbuffersEnvelope(bb);

    const topic_bytes = envelope.topicArray(); // Uint8Array | null
    const topic = topic_bytes
      ? new TextDecoder("utf-8").decode(topic_bytes)
      : "";

    let txid = "";
    if (envelope.messageType() == Message.FlatbuffersCommand) {
      if (topic.includes("ephemeral")) {
        txid = this.txid;
      } else {
        const cmd: FlatbuffersCommand = envelope.message(
          new FlatbuffersCommand(),
        );
        const bytes = cmd.requestTxidArray();
        txid = bytes ? new TextDecoder("utf-8").decode(bytes) : "";
      }
    } else {
      const bytes = envelope.txidArray();
      txid = bytes ? new TextDecoder("utf-8").decode(bytes) : "";
    }

    console.log(`Received binary message, txid: ${txid} topic: ${topic}`);

    const pending = this.pending.get("xyz");
    if (!pending) {
      console.warn("Unmatched WS message:", txid);
      return;
    }

    clearTimeout(pending.timeout);
    this.pending.delete("xyz");
    pending.resolve(base64ToUint8(data));
  };

  private constructCommand(
    topic: string,
    messageId: string,
    commandType: CommandType,
    payload: string,
    deviceType: string,
    deviceID: string,
    devicePrincipal: string,
    responseSubscribed: any,
    qos: number,
    token: string,
    signature: string,
    responseTopic: string,
  ): Uint8Array {
    const builder = new flatbuffers.Builder(1024);
    try {
      const encoder = new TextEncoder();
      const epochSec = Math.floor(Date.now() / 1000);
      const expiryEpochSec = Math.floor(Date.now() / 1000) + 20 * 60;
      const tokenOffset = builder.createByteVector(encoder.encode(token));
      const signatureOffset = builder.createByteVector(
        encoder.encode(signature),
      );
      FlatbuffersMessageOptions.createResponseSubscribedVector(
        builder,
        responseSubscribed,
      );
      FlatbuffersMessageOptions.startFlatbuffersMessageOptions(builder);
      FlatbuffersMessageOptions.addToken(builder, tokenOffset);
      FlatbuffersMessageOptions.addQos(builder, qos);
      FlatbuffersMessageOptions.addSignature(builder, signatureOffset);
      const optionOffset =
        FlatbuffersMessageOptions.endFlatbuffersMessageOptions(builder);

      const payloadOffset = builder.createByteVector(encoder.encode(payload));
      const responseTopicOffset = builder.createByteVector(
        encoder.encode(responseTopic),
      );
      const deviceTypeOffset = builder.createByteVector(
        encoder.encode(deviceType),
      );
      const deviceIDOffset = builder.createByteVector(encoder.encode(deviceID));
      const devicePrincipalOffset = builder.createByteVector(
        encoder.encode(devicePrincipal),
      );
      FlatbuffersCommand.startFlatbuffersCommand(builder);
      FlatbuffersCommand.addCreatedAt(builder, epochSec);
      FlatbuffersCommand.addCommandType(builder, commandType.valueOf());
      FlatbuffersCommand.addResponseTopic(builder, responseTopicOffset);
      FlatbuffersCommand.addExpiry(builder, expiryEpochSec);
      FlatbuffersCommand.addPayload(builder, payloadOffset);
      FlatbuffersCommand.addOptions(builder, optionOffset);
      FlatbuffersCommand.addDeviceType(builder, deviceTypeOffset);
      FlatbuffersCommand.addDeviceId(builder, deviceIDOffset);
      FlatbuffersCommand.addDevicePrincipal(builder, devicePrincipalOffset);
      const cmdOffset = FlatbuffersCommand.endFlatbuffersCommand(builder);

      const txidOffset = builder.createByteVector(encoder.encode(this.txid));
      const topicOffset = builder.createByteVector(encoder.encode(topic));
      const messageIDOffset = builder.createByteVector(
        encoder.encode(messageId),
      );

      FlatbuffersEnvelope.startFlatbuffersEnvelope(builder);
      FlatbuffersEnvelope.addTxid(builder, txidOffset);
      FlatbuffersEnvelope.addTopic(builder, topicOffset);
      FlatbuffersEnvelope.addMessageId(builder, messageIDOffset);
      FlatbuffersEnvelope.addMessage(builder, cmdOffset);
      FlatbuffersEnvelope.addMessageType(builder, Message.FlatbuffersCommand);
      const packet = FlatbuffersEnvelope.endFlatbuffersEnvelope(builder);

      builder.finish(packet);
    } catch (e) {
      console.log("construct command exception: ", e);
    }

    return builder.asUint8Array();
  }

  private constructSubscribe(
    topic: string,
    messageID: string,
    name: string,
    error: string,
    namespace: string,
    kind: number,
  ): Uint8Array {
    const encoder = new TextEncoder();

    const builder = new flatbuffers.Builder(1024);
    const nameOffset = builder.createByteVector(encoder.encode(name));
    const errorOffset = builder.createByteVector(encoder.encode(error));
    const namespaceOffset = builder.createByteVector(encoder.encode(namespace));

    FlatbuffersSubscribe.startFlatbuffersSubscribe(builder);

    FlatbuffersSubscribe.addKind(builder, kind);
    FlatbuffersSubscribe.addName(builder, nameOffset);
    FlatbuffersSubscribe.addError(builder, errorOffset);
    FlatbuffersSubscribe.addNamespacePrefix(builder, namespaceOffset);
    const subscribe = FlatbuffersSubscribe.endFlatbuffersSubscribe(builder);

    const txidOffset = builder.createByteVector(encoder.encode(this.txid));
    const topicOffset = builder.createByteVector(encoder.encode(topic));
    const messageIDOffset = builder.createByteVector(encoder.encode(messageID));

    FlatbuffersEnvelope.startFlatbuffersEnvelope(builder);
    FlatbuffersEnvelope.addTxid(builder, txidOffset);
    FlatbuffersEnvelope.addTopic(builder, topicOffset);
    FlatbuffersEnvelope.addMessage(builder, subscribe);
    FlatbuffersEnvelope.addMessageType(builder, Message.FlatbuffersSubscribe);
    FlatbuffersEnvelope.addMessageId(builder, messageIDOffset);
    const packet = FlatbuffersEnvelope.endFlatbuffersEnvelope(builder);

    builder.finish(packet);
    return builder.asUint8Array();
  }

  private constructUnsubscribe(
    topic: string,
    messageID: string,
    name: string,
    error: string,
    namespace: string,
    kind: number,
  ): Uint8Array {
    const encoder = new TextEncoder();

    const builder = new flatbuffers.Builder(1024);
    const nameOffset = builder.createByteVector(encoder.encode(name));
    const errorOffset = builder.createByteVector(encoder.encode(error));
    const namespaceOffset = builder.createByteVector(encoder.encode(namespace));

    FlatbuffersUnsubscribe.startFlatbuffersUnsubscribe(builder);

    FlatbuffersUnsubscribe.addKind(builder, kind);
    FlatbuffersUnsubscribe.addName(builder, nameOffset);
    FlatbuffersUnsubscribe.addError(builder, errorOffset);
    FlatbuffersUnsubscribe.addNamespacePrefix(builder, namespaceOffset);
    const subscribe = FlatbuffersUnsubscribe.endFlatbuffersUnsubscribe(builder);

    const txidOffset = builder.createByteVector(encoder.encode(this.txid));
    const topicOffset = builder.createByteVector(encoder.encode(topic));
    const messageIDOffset = builder.createByteVector(encoder.encode(messageID));

    FlatbuffersEnvelope.startFlatbuffersEnvelope(builder);
    FlatbuffersEnvelope.addTxid(builder, txidOffset);
    FlatbuffersEnvelope.addTopic(builder, topicOffset);
    FlatbuffersEnvelope.addMessage(builder, subscribe);
    FlatbuffersEnvelope.addMessageType(builder, Message.FlatbuffersUnsubscribe);
    FlatbuffersEnvelope.addMessageId(builder, messageIDOffset);
    const packet = FlatbuffersEnvelope.endFlatbuffersEnvelope(builder);

    builder.finish(packet);
    return builder.asUint8Array();
  }

  public async connect(): Promise<string> {
    return this.ws.connect({
      "X-Ssl-Client-Cert":
        "MIIDMzCCAhsCFDXGga4JSMEujL5rMZabeeHFpTmPMA0GCSqGSIb3DQEBCwUAMFQx" +
        "CzAJBgNVBAYTAlVTMQ4wDAYDVQQIDAVTdGF0ZTENMAsGA1UEBwwEQ2l0eTEVMBMG" +
        "A1UECgwMT3JnYW5pemF0aW9uMQ8wDQYDVQQDDAZUZXN0Q0EwHhcNMjYwMTA3MDQw" +
        "NjI5WhcNMzYwMTA1MDQwNjI5WjBYMQswCQYDVQQGEwJVUzEOMAwGA1UECAwFU3Rh" +
        "dGUxDTALBgNVBAcMBENpdHkxFTATBgNVBAoMDE9yZ2FuaXphdGlvbjETMBEGA1UE" +
        "AwwKVGVzdENsaWVudDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJkf" +
        "wytr6bkpC+W+SGzdIIUbHN4CpexMYzP5emyzGDv9p9dsM6gqxjMs3zrmswUjWiI1" +
        "5otL8TEIQQH0ABbxBfCtzv4Gs6DQnBc8JPd3rbSNFNQ5WcofW5M868L2VBQP/raR" +
        "DM/EW6rOQBMwnvV+gNIq9Uaryyz4w7gmcVeOs2+bPN+8GPYVsEQKhFcRoE5Fv7pc" +
        "Yxj7JG+LE/mAlvGwlnGIy60azp8n09gm21awhjjtphMW6o2jN14lw93YnuT/yXcO" +
        "2U4qc3VKnK9QGF/Xus2lb7DLBTtJAuwVRXMiItoGi31skMIH6FnHrnsB0bvJLGr1" +
        "wKTSdccYNi10kruJVbUCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAemVdnFrllvtr" +
        "kkQReKPg58IFGxcix2HdSJQi+3rhD8p2ijikdLON6iKhW8GtuN575xkPNG0EhMNy" +
        "v1KWwNrvzND5inGNDuUUxBZ9CG7baPEmfHgFwBuH+VmoxMXv44bil1epaiYX3GIP" +
        "0wOzjyTBXo7XKqneVQgxjAr8BwLcNxSHVFAKupkK1i4PoMjba61RGxPoaisjoBEi" +
        "CVCLKQ04+iDTkB7m9dV+Boy3uQG0+C4Hj1qJHf6c0zSBsgmTN1zgQhIyhsplbeU2" +
        "xhsCnBrVLsU1oL+rbXbpg1Dg8OMGrlh4X8loDeJ0mZiX7M0k9egUTRFvjEyC7EDy" +
        "6dTMiDfpjA==",
    });
  }

  public close(): void {
    this.ws.close();
  }

  public sendSubscribe(
    topic: string,
    queueName: string,
    error: string,
    namespace: string,
    kind: TopicType,
    timeoutMs: number = 5000,
  ): Promise<Uint8Array> {
    const messageID = uuidv4();
    const subscribe = this.constructSubscribe(
      topic,
      messageID,
      queueName,
      error,
      namespace,
      kind.valueOf(),
    );
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete("xyz");
        reject(new Error("WebSocket response timeout"));
      }, timeoutMs);

      try {
        this.pending.set("xyz", { resolve, reject, timeout });
        const cmdStr = uint8ToBase64(subscribe);
        this.ws.send(cmdStr);
      } catch (e) {
        console.log(`send subscribe exception in promise:`, e);
      }
    });
  }

  public sendUnsubscribe(
    topic: string,
    queueName: string,
    error: string,
    namespace: string,
    kind: TopicType,
    timeoutMs: number = 5000,
  ): Promise<Uint8Array> {
    const messageID = uuidv4();
    const unsubscribe = this.constructUnsubscribe(
      topic,
      messageID,
      queueName,
      error,
      namespace,
      kind.valueOf(),
    );
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete("xyz");
        reject(new Error("WebSocket response timeout"));
      }, timeoutMs);

      try {
        this.pending.set("xyz", { resolve, reject, timeout });
        const cmdStr = uint8ToBase64(unsubscribe);
        this.ws.send(cmdStr);
      } catch (e) {
        console.log(`send unsubscribe exception in promise:`, e);
      }
    });
  }

  public sendCommand(
    deviceID: string,
    cmdType: CommandType,
    payload: string,
    timeoutMs: number = 5000,
  ): Promise<Uint8Array> {
    const messageID = uuidv4();
    const cmdTopic = `platform.${deviceID}.command`;
    const responseTopic = `platform.ephemeral.${deviceID}-${this.txid}`;
    const command = this.constructCommand(
      cmdTopic,
      messageID,
      cmdType.valueOf(),
      payload,
      this.deviceType,
      deviceID,
      this.devicePrincipal,
      this.responseSubscribed,
      this.qos,
      this.token,
      this.signature,
      responseTopic,
    );

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete("xyz");
        reject(new Error("WebSocket response timeout"));
      }, timeoutMs);

      try {
        this.pending.set("xyz", { resolve, reject, timeout });
        const cmdStr = uint8ToBase64(command);
        this.ws.send(cmdStr);
      } catch (e) {
        console.log(`send command exception in promise:`, e);
      }
    });
  }

  public waitForResponse(timeoutMs: number = 5000): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete("xyz");
        reject(new Error("WebSocket response timeout"));
      }, timeoutMs);

      try {
        this.pending.set("xyz", { resolve, reject, timeout });
      } catch (e) {
        console.log(`send command exception in promise:`, e);
      }
    });
  }

  public getTxid(): string {
    return this.txid;
  }

  public async executeCommand(devID: string, payload: string): Promise<string> {
    const respTopic = `platform.ephemeral.${devID}-${this.txid}`;
    const subResp = await this.sendSubscribe(
      respTopic,
      respTopic,
      "",
      "",
      TopicType.TOPIC_TYPE_EPHEMERAL_TOPIC,
    );
    console.log(`subResp: ${subResp.length}`);
    const cmdResp = await this.sendCommand(
      devID,
      CommandType.HardwareOperation,
      payload,
    );
    console.log(`cmdResp: ${cmdResp.length}`);
    const waitResp = await this.waitForResponse();
    console.log(`waitResp: ${waitResp.length}`);

    const bb = new flatbuffers.ByteBuffer(waitResp);
    const envelope = FlatbuffersEnvelope.getRootAsFlatbuffersEnvelope(bb);
    let operationResponse = "";
    if (envelope.messageType() == Message.FlatbuffersCommand) {
      const cmd: FlatbuffersCommand = envelope.message(
        new FlatbuffersCommand(),
      );
      const payloadBytes = cmd.payloadArray();
      operationResponse = payloadBytes
        ? new TextDecoder("utf-8").decode(payloadBytes)
        : "";
    }

    await this.sendUnsubscribe(
      respTopic,
      respTopic,
      "",
      "",
      TopicType.TOPIC_TYPE_EPHEMERAL_TOPIC,
    );

    return new Promise((resolve, reject) => {
      if (operationResponse.length > 0) {
        try {
          resolve(operationResponse);
        } catch (e) {
          reject(new Error(`failed to parse json from ${operationResponse}`));
        }
      } else {
        reject(new Error(`does not receive valid status`));
      }
    });
  }

  public async queryStatus(devID: string): Promise<{ status: number[] }> {
    const respTopic = `platform.ephemeral.${devID}-${this.txid}`;
    const subResp = await this.sendSubscribe(
      respTopic,
      respTopic,
      "",
      "",
      TopicType.TOPIC_TYPE_EPHEMERAL_TOPIC,
    );
    console.log(`subResp: ${subResp.length}`);
    const cmdResp = await this.sendCommand(devID, CommandType.StatusQuery, "");
    console.log(`cmdResp: ${cmdResp.length}`);
    const waitResp = await this.waitForResponse();
    console.log(`waitResp: ${waitResp.length}`);

    const bb = new flatbuffers.ByteBuffer(waitResp);
    const envelope = FlatbuffersEnvelope.getRootAsFlatbuffersEnvelope(bb);
    let status = "";
    if (envelope.messageType() == Message.FlatbuffersCommand) {
      const cmd: FlatbuffersCommand = envelope.message(
        new FlatbuffersCommand(),
      );
      const payloadBytes = cmd.payloadArray();
      status = payloadBytes
        ? new TextDecoder("utf-8").decode(payloadBytes)
        : "";
    }

    await this.sendUnsubscribe(
      respTopic,
      respTopic,
      "",
      "",
      TopicType.TOPIC_TYPE_EPHEMERAL_TOPIC,
    );

    return new Promise((resolve, reject) => {
      if (status.length > 0) {
        try {
          resolve(JSON.parse(status));
        } catch (e) {
          reject(new Error(`failed to parse json from ${status}`));
        }
      } else {
        reject(new Error(`does not receive valid status`));
      }
    });
  }

  public async queryConfig(devID: string): Promise<{
    ssid: string;
    voltage: number;
    mdns: string;
    fwver: string;
    hwver: string;
    tmzoneoffset: number;
    rssi: number;
  }> {
    const respTopic = `platform.ephemeral.${devID}-${this.txid}`;
    const subResp = await this.sendSubscribe(
      respTopic,
      respTopic,
      "",
      "",
      TopicType.TOPIC_TYPE_EPHEMERAL_TOPIC,
    );
    console.log(`subResp: ${subResp.length}`);
    const cmdResp = await this.sendCommand(devID, CommandType.ConfigQuery, "");
    console.log(`cmdResp: ${cmdResp.length}`);
    const waitResp = await this.waitForResponse();
    console.log(`waitResp: ${waitResp.length}`);

    const bb = new flatbuffers.ByteBuffer(waitResp);
    const envelope = FlatbuffersEnvelope.getRootAsFlatbuffersEnvelope(bb);
    let config = "";
    if (envelope.messageType() == Message.FlatbuffersCommand) {
      const cmd: FlatbuffersCommand = envelope.message(
        new FlatbuffersCommand(),
      );
      const payloadBytes = cmd.payloadArray();
      config = payloadBytes
        ? new TextDecoder("utf-8").decode(payloadBytes)
        : "";
      console.log(`config: ${config}`);
    }

    const unsubResp = this.sendUnsubscribe(
      respTopic,
      respTopic,
      "",
      "",
      TopicType.TOPIC_TYPE_EPHEMERAL_TOPIC,
    );

    return new Promise((resolve, reject) => {
      if (config.length > 0) {
        try {
          resolve(JSON.parse(config));
        } catch (e) {
          reject(new Error(`failed to parse json from ${config}`));
        }
      } else {
        reject(new Error(`does not receive valid config`));
      }
    });
  }
}

export { TopicType, WebsocketService };
