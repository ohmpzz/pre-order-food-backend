import line_login from 'line-login';

export const LINE = new line_login({
  channel_id: process.env.LINE_LOGIN_CHANNEL_ID || '123',
  channel_secret: process.env.LINE_LOGIN_CHANNEL_SECRET || '123',
  callback_url: process.env.LINE_LOGIN_CALLBACK_URL || '123',
  scope: 'openid profile email',
  prompt: 'consent',
  bot_prompt: 'normal',
});
