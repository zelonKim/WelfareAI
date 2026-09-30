export interface SendMultiplePushNotificationsDto {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, any>;
}