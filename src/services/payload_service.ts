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
  FlatbuffersSubscribe,
  FlatbuffersUnsubscribe,
  Message,
} from "./flatbuffersmsg";

enum CommandType {
  HardwareOperation = 900,
  StatusQuery = 910,
  ConfigQuery = 920,
  FirmwareImage = 930,
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

type BinaryMessageCallback = (data: Uint8Array) => boolean | void;

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
  private static instance: WebsocketService | null = null;

  public static getInstance(): WebsocketService {
    if (!WebsocketService.instance) {
      WebsocketService.instance = new WebsocketService();
    }
    return WebsocketService.instance;
  }

  private deviceType = "";
  private url: string = "wss://iot.sensorsparks.com:8080/testapi";
  private ws: WebSocketWithSelfSignedCert;
  private pending = new Map<string, PendingRequest>();
  private callbacks = new Map<string, BinaryMessageCallback>();
  private connected = false;
  private connectResolve: ((str: string) => void) | null = null;
  private connectReject: ((err: Error) => void) | null = null;
  private closeResolve: (() => void) | null = null;

  private constructor() {
    this.ws = WebSocketWithSelfSignedCert.getInstance(this.url);
    this.bindSocketListeners(this.ws);
  }

  private bindSocketListeners(ws: WebSocketWithSelfSignedCert): void {
    ws.onBinaryMessage(this.handleBinaryMessage);
    ws.onClose(() => {
      console.log("websocket closed!");
      this.connected = false;
      if (this.closeResolve) {
        this.closeResolve();
        this.closeResolve = null;
      }
    });
    ws.onOpen(() => {
      console.log("websocket opened!");
      this.connected = true;
      if (this.connectResolve) {
        console.log(`connectResolved!`)
        this.connectResolve("connected");
        this.resetConnectPromise();
      }
    });
    ws.onError((err) => {
      console.log(`websocket error!: ${err}`);
      this.connected = false;
      if (this.connectReject) {
        this.connectReject(new Error(`WebSocket error: ${err}`));
        this.resetConnectPromise();
      }
    });
  }

  private reinitializeSocket(): void {
    this.ws = WebSocketWithSelfSignedCert.getInstance(this.url);
    this.bindSocketListeners(this.ws);
  }

  private resetConnectPromise(): void {
    this.connectResolve = null;
    this.connectReject = null;
  }

  private handleBinaryMessage = (data: string | Uint8Array): void => {
    const payload = typeof data === "string" ? base64ToUint8(data) : data;
    const bb = new flatbuffers.ByteBuffer(payload);
    const envelope = FlatbuffersEnvelope.getRootAsFlatbuffersEnvelope(bb);

    let bytes = envelope.topicArray(); // Uint8Array | null
    const topic = bytes ? new TextDecoder("utf-8").decode(bytes) : "";
    bytes = envelope.txidArray();
    let txid = "";
    if (envelope.messageType() == Message.FlatbuffersCommand) {
      const cmd: FlatbuffersCommand = envelope.message(
        new FlatbuffersCommand(),
      );
      const bytes = cmd.requestTxidArray();
      txid = bytes ? new TextDecoder("utf-8").decode(bytes) : "";
    } else {
      const bytes = envelope.txidArray();
      txid = bytes ? new TextDecoder("utf-8").decode(bytes) : "";
    }

    const pending = this.pending.get(txid);
    if (!pending) {
      const callback = this.callbacks.get(txid);
      if (callback) {
        const shouldUnregister = callback(payload);
        if (shouldUnregister) {
          this.callbacks.delete(txid);
        }
        return;
      }

      console.warn(
        `handleBinaryMessage: unmatched txid ${txid} for topic ${topic}， type: ${envelope.messageType()}`,
      );
      return;
    }

    clearTimeout(pending.timeout);
    this.pending.delete(txid);
    pending.resolve(payload);
  };

  public registerCallback(txid: string, callback: BinaryMessageCallback): void {
    this.callbacks.set(txid, callback);
  }

  public unregisterCallback(txid: string): void {
    this.callbacks.delete(txid);
  }

  private constructCommand(
    topic: string,
    txid: string,
    messageId: string,
    commandType: CommandType,
    payload: string,
    deviceType: string,
    deviceID: string,
    responseTopic: string,
  ): Uint8Array {
    const builder = new flatbuffers.Builder(1024);
    try {
      const encoder = new TextEncoder();
      const epochSec = Math.floor(Date.now() / 1000);
      const expiryEpochSec = Math.floor(Date.now() / 1000) + 20 * 60;

      const payloadOffset = builder.createByteVector(encoder.encode(payload));
      const responseTopicOffset = builder.createByteVector(
        encoder.encode(responseTopic),
      );
      const deviceTypeOffset = builder.createByteVector(
        encoder.encode(deviceType),
      );
      const deviceIDOffset = builder.createByteVector(encoder.encode(deviceID));
      FlatbuffersCommand.startFlatbuffersCommand(builder);
      FlatbuffersCommand.addCreatedAt(builder, epochSec);
      FlatbuffersCommand.addCommandType(builder, commandType.valueOf());
      FlatbuffersCommand.addResponseTopic(builder, responseTopicOffset);
      FlatbuffersCommand.addExpiry(builder, expiryEpochSec);
      FlatbuffersCommand.addPayload(builder, payloadOffset);
      FlatbuffersCommand.addDeviceType(builder, deviceTypeOffset);
      FlatbuffersCommand.addDeviceId(builder, deviceIDOffset);
      const cmdOffset = FlatbuffersCommand.endFlatbuffersCommand(builder);

      const txidOffset = builder.createByteVector(encoder.encode(txid));
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
    txid: string,
    messageID: string,
    name: string,
    error: string,
    kind: number,
  ): Uint8Array {
    const encoder = new TextEncoder();

    const builder = new flatbuffers.Builder(1024);
    const nameOffset = builder.createByteVector(encoder.encode(name));
    const errorOffset = builder.createByteVector(encoder.encode(error));

    FlatbuffersSubscribe.startFlatbuffersSubscribe(builder);

    FlatbuffersSubscribe.addKind(builder, kind);
    FlatbuffersSubscribe.addName(builder, nameOffset);
    FlatbuffersSubscribe.addError(builder, errorOffset);
    const subscribe = FlatbuffersSubscribe.endFlatbuffersSubscribe(builder);

    const txidOffset = builder.createByteVector(encoder.encode(txid));
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
    txid: string,
    messageID: string,
    name: string,
    error: string,
    kind: number,
  ): Uint8Array {
    const encoder = new TextEncoder();

    const builder = new flatbuffers.Builder(1024);
    const nameOffset = builder.createByteVector(encoder.encode(name));
    const errorOffset = builder.createByteVector(encoder.encode(error));

    FlatbuffersUnsubscribe.startFlatbuffersUnsubscribe(builder);

    FlatbuffersUnsubscribe.addKind(builder, kind);
    FlatbuffersUnsubscribe.addName(builder, nameOffset);
    FlatbuffersUnsubscribe.addError(builder, errorOffset);
    const subscribe = FlatbuffersUnsubscribe.endFlatbuffersUnsubscribe(builder);

    const txidOffset = builder.createByteVector(encoder.encode(txid));
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

  public isConnected(): boolean {
    return this.connected;
  }

  public connect(): Promise<string> {
    if (this.connected) return Promise.resolve("already connected");
    return new Promise((resolve, reject) => {
      this.connectResolve = resolve;
      this.connectReject = reject;
      this.ws.connect({
        "X-Ssl-Client-Cert":
          "MIIC5DCCAcwCFC1/sML6wbqRK9IQamql9wGzzky7MA0GCSqGSIb3DQEBCwUAMC4x" +
          "FTATBgNVBAoMDFNlbnNvcnNwYXJrczEVMBMGA1UEAwwMU2Vuc29yU3BhcmtzMB4X" +
          "DTI2MDUxMDE0MzEzN1oXDTM2MDUwNzE0MzEzN1owLzEVMBMGA1UECgwMU2Vuc29y" +
          "c3BhcmtzMRYwFAYDVQQDDA1tb2JpbGUtY2xpZW50MIIBIjANBgkqhkiG9w0BAQEF" +
          "AAOCAQ8AMIIBCgKCAQEA0qywm1KFObCd3CJ4wNDB2M8sXw8K3MHMez3QoocrR9lE" +
          "JL+A9s4dK2MOqU5C/PBPxjcviY63Rj4jz9y5g1fJrxdhqcD7vPBb6WyFLxCaoxxu" +
          "g2w2pRmhZ7xKDs3xl7C0mCVQnULHbeo7qWPD33ncZ6n0EaYuIHMfGn924O+uC/hy" +
          "ODFrcTqjV+O/kL25UGlCJwWeqIP6nuvORza0PoDodznRqW6nYdJ5S2TPY7cpN/d5" +
          "BViFUIapa63+IPI92ddPYdS0nAZpctMVVQMunkMYhruzOG17SKUiNJNN12K01/P7" +
          "TrsvutqNkS0ZI3kzHXJ5rG5/xWlTt8Xy7+K1xNFT7wIDAQABMA0GCSqGSIb3DQEB" +
          "CwUAA4IBAQBKAgGmkiTzzEfqWPBrpofhXnb08N9gNh701EVqgD3H40nVA/7AjZOw" +
          "gF3b421AnQSYR7AE7ObT4/Akab28Rs5cW3Ie0I0hnEaZhSihSyGwcgZUgVyPmkCO" +
          "IaRJiaMF/KDCIRorY+ezvx7/F7CA1Uncd3GWPl5CI2bEsYjNsBTEKtX+lVoOlHlr" +
          "/aioA/DXhWECfFijrW3phtzVpjwkfyYG+u5MgVM2srY9wJzdt0ckor2YPjnhp5zV" +
          "zCmQrFD+/zLhs+4ns4ehc6RVX2E2EbSjZA27stkJl13JariwqxDfU6n/DbEveZoN" +
          "JdMTxglzFcMZ/gOY99TZHlbSW9RYvXOP",
      });
    });
  }

  public close(timeoutMs: number = 3000): Promise<void> {
    if (!this.connected) return Promise.resolve();
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        console.warn("ws.close(): onClose did not fire, resolving by timeout");
        this.connected = false;
        this.closeResolve = null;
        resolve();
      }, timeoutMs);
      this.closeResolve = () => {
        clearTimeout(timer);
        resolve();
      };
      this.ws.close();
      // Library close() removes listeners from current instance.
      // Prepare a fresh instance for the next connect() call.
      this.reinitializeSocket();
    });
  }

  public sendSubscribe(
    topic: string,
    txid: string,
    queueName: string,
    error: string,
    kind: TopicType,
    timeoutMs: number = 10000,
  ): Promise<Uint8Array> {
    if (!this.connected) return Promise.reject(new Error("not connected"));
    const messageId = uuidv4();
    const subscribe = this.constructSubscribe(
      topic,
      txid,
      messageId,
      queueName,
      error,
      kind.valueOf(),
    );
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(txid);
        reject(
          new Error(
            `waiting subscribe response timeout, topic: ${topic}, txid: ${txid}`,
          ),
        );
      }, timeoutMs);

      try {
        this.pending.set(txid, { resolve, reject, timeout });
        const cmdStr = uint8ToBase64(subscribe);
        this.ws.sendBinaryBase64(cmdStr);
      } catch (e) {
        console.log(`send subscribe exception in promise:`, e);
      }
    });
  }

  public sendUnsubscribe(
    topic: string,
    txid: string,
    queueName: string,
    error: string,
    kind: TopicType,
    timeoutMs: number = 10000,
  ): Promise<Uint8Array> {
    if (!this.connected) return Promise.reject(new Error("not connected"));
    const messageID = uuidv4();
    const newTxid = uuidv4();
    const unsubscribe = this.constructUnsubscribe(
      topic,
      newTxid,
      messageID,
      queueName,
      error,
      kind.valueOf(),
    );
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(newTxid);
        reject(
          new Error(
            `waiting unsubscribe response timeout, topic: ${topic}, txid: ${newTxid}`,
          ),
        );
      }, timeoutMs);

      try {
        this.pending.set(newTxid, { resolve, reject, timeout });
        const cmdStr = uint8ToBase64(unsubscribe);
        this.ws.sendBinaryBase64(cmdStr);
      } catch (e) {
        console.log(`send unsubscribe exception in promise:`, e);
      }
    });
  }

  public sendCommand(
    deviceID: string,
    txid: string,
    cmdType: CommandType,
    payload: string,
    timeoutMs: number = 10000,
  ): Promise<Uint8Array> {
    if (!this.connected) return Promise.reject(new Error("not connected"));
    const messageID = uuidv4();
    const cmdTopic = `platform.${deviceID}.command`;
    const responseTopic = `platform.ephemeral.${deviceID}-${txid}`;

    const command = this.constructCommand(
      cmdTopic,
      txid,
      messageID,
      cmdType.valueOf(),
      payload,
      this.deviceType,
      deviceID,
      responseTopic,
    );

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(txid);
        reject(
          new Error(
            `waiting commmand response timeout, topic: ${cmdTopic}, txid: ${txid}`,
          ),
        );
      }, timeoutMs);

      try {
        this.pending.set(txid, { resolve, reject, timeout });
        const cmdStr = uint8ToBase64(command);
        this.ws.sendBinaryBase64(cmdStr);
      } catch (e) {
        console.log(`send command exception in promise:`, e);
      }
    });
  }

  public sendFwRequest(
    txid: string,
    devID: string = "",
    payload: string = "",
    respTopic: string = "",
    timeoutMs: number = 10000
  ): Promise<Uint8Array> {
    if (!this.connected) return Promise.reject(new Error("not connected"));
    const messageID = uuidv4();
    let cmdTopic
    if (devID == "") {
      cmdTopic = `firmware.query.latest`;
    } else {
      cmdTopic = `platform.${devID}.command`
    }
    const command = this.constructCommand(
      cmdTopic,
      txid,
      messageID,
      CommandType.FirmwareImage.valueOf(),
      payload,
      this.deviceType,
      devID,
      respTopic,
    );

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(txid);
        reject(
          new Error(
            `waiting commmand response timeout, topic: ${cmdTopic}, txid: ${txid}`,
          ),
        );
      }, timeoutMs);

      try {
        this.pending.set(txid, { resolve, reject, timeout });
        const cmdStr = uint8ToBase64(command);
        this.ws.sendBinaryBase64(cmdStr);
      } catch (e) {
        console.log(`send command exception in promise:`, e);
      }
    });
  }

  public waitCommandResponse(
    txid: string,
    timeoutMs: number = 10000,
  ): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(txid);
        reject(new Error("WebSocket response timeout"));
      }, timeoutMs);

      try {
        this.pending.set(txid, { resolve, reject, timeout });
      } catch (e) {
        console.log(`send command exception in promise:`, e);
      }
    });
  }

  public async executeCommand(devID: string, payload: string): Promise<string> {
    const txid = uuidv4();
    const respTopic = `platform.ephemeral.${devID}-${txid}`;
    const queueName = respTopic;
    const subResp = await this.sendSubscribe(
      respTopic,
      txid,
      queueName,
      "",
      TopicType.TOPIC_TYPE_EPHEMERAL_TOPIC,
    );
    const cmdResp = await this.sendCommand(
      devID,
      txid,
      CommandType.HardwareOperation,
      payload,
    );
    const cmdBb = new flatbuffers.ByteBuffer(cmdResp);
    const cmdEnvelop = FlatbuffersEnvelope.getRootAsFlatbuffersEnvelope(cmdBb);
    const txidBytes = cmdEnvelop.txidArray();
    const respTxid = txidBytes
      ? new TextDecoder("utf-8").decode(txidBytes)
      : "";
    const waitResp = await this.waitCommandResponse(txid);
    const respBb = new flatbuffers.ByteBuffer(waitResp);
    const respEnvelop =
      FlatbuffersEnvelope.getRootAsFlatbuffersEnvelope(respBb);
    let operationResponse = "";
    if (respEnvelop.messageType() == Message.FlatbuffersCommand) {
      const cmd: FlatbuffersCommand = respEnvelop.message(
        new FlatbuffersCommand(),
      );
      const payloadBytes = cmd.payloadArray();
      operationResponse = payloadBytes
        ? new TextDecoder("utf-8").decode(payloadBytes)
        : "";
    }

    await this.sendUnsubscribe(
      respTopic,
      txid,
      queueName,
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
    const txid = uuidv4();
    const respTopic = `platform.ephemeral.${devID}-${txid}`;
    const queueName = respTopic;
    const subResp = await this.sendSubscribe(
      respTopic,
      txid,
      queueName,
      "",
      TopicType.TOPIC_TYPE_EPHEMERAL_TOPIC,
    );
    const cmdResp = await this.sendCommand(
      devID,
      txid,
      CommandType.StatusQuery,
      "",
    );
    const cmdBb = new flatbuffers.ByteBuffer(cmdResp);
    const cmdEnvelop = FlatbuffersEnvelope.getRootAsFlatbuffersEnvelope(cmdBb);
    const txidBytes = cmdEnvelop.txidArray();
    const respTxid = txidBytes
      ? new TextDecoder("utf-8").decode(txidBytes)
      : "";
    const waitResp = await this.waitCommandResponse(txid);

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
      txid,
      queueName,
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
    const txid = uuidv4();
    const respTopic = `platform.ephemeral.${devID}-${txid}`;
    const queueName = respTopic;
    const subResp = await this.sendSubscribe(
      respTopic,
      txid,
      queueName,
      "",
      TopicType.TOPIC_TYPE_EPHEMERAL_TOPIC,
    );
    const cmdResp = await this.sendCommand(
      devID,
      txid,
      CommandType.ConfigQuery,
      "",
    );
    const cmdBb = new flatbuffers.ByteBuffer(cmdResp);
    const cmdEnvelop = FlatbuffersEnvelope.getRootAsFlatbuffersEnvelope(cmdBb);
    const txidBytes = cmdEnvelop.txidArray();
    const respTxid = txidBytes
      ? new TextDecoder("utf-8").decode(txidBytes)
      : "";
    const waitResp = await this.waitCommandResponse(txid);
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

    const unsubResp = await this.sendUnsubscribe(
      respTopic,
      txid,
      queueName,
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

  public async queryLatestFw(): Promise<{
    version: string;
    size: number;
    filename: string;
  }> {
    const cmdResp = await this.sendFwRequest(uuidv4());

    const bb = new flatbuffers.ByteBuffer(cmdResp);
    const envelope = FlatbuffersEnvelope.getRootAsFlatbuffersEnvelope(bb);
    let fw = "";
    if (envelope.messageType() == Message.FlatbuffersCommand) {
      const cmd: FlatbuffersCommand = envelope.message(new FlatbuffersCommand());
      const payloadBytes = cmd.payloadArray();
      fw = payloadBytes ? new TextDecoder("utf-8").decode(payloadBytes) : "";
    }

    return new Promise((resolve, reject) => {
      if (fw.length > 0) {
        try {
          resolve(JSON.parse(fw));
        } catch (e) {
          reject(new Error(`failed to parse json from ${fw}`));
        }
      } else {
        reject(new Error(`does not receive valid firmware info`));
      }
    });
  }

  public async triggerFwUpdate(
    devID: string,
    onUpdate?: BinaryMessageCallback,
  ): Promise<string> {
    const txid = uuidv4()
    const respTopic = `platform.ephemeral.${devID}-${txid}`;
    const queueName = respTopic;
    const subResp = await this.sendSubscribe(
      respTopic,
      txid,
      queueName,
      "",
      TopicType.TOPIC_TYPE_EPHEMERAL_TOPIC,
    );
    if (onUpdate) {
      console.log(`register call back on txid: ${txid}`)
      this.registerCallback(txid, onUpdate);
    }
    const payload = {
      interval: 5
    }
    const resp = await this.sendFwRequest(txid, devID, JSON.stringify(payload), respTopic);
    return txid;
  }
}

export { TopicType, WebsocketService };

