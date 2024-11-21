// signalRConnection.jsx
import { HubConnectionBuilder, LogLevel, HttpTransportType } from "@microsoft/signalr";
import API_ENDPOINTS from "../constant/linkapi";
let connection;

export function getConnection() {
  if (!connection) {
    connection = new HubConnectionBuilder()
      .withUrl(API_ENDPOINTS.HUB_URL, {
        transport: HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents |  HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
    connection.serverTimeoutInMilliseconds = 2 * 60 * 1000;
  }
  return connection;
}

export default getConnection;
