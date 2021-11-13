export const handler = (event: any, context: any, callback: any) => {
  const domain = process.env.domain ?? "no-domain.com";
  if (event.triggerSource === "CustomMessage_SignUp") {
    const code = event.request.codeParameter;
    const username = encodeURIComponent(event.request.userAttributes.email);
    event.response.emailSubject = "Confirm Your Email | Sinilinx!";
    event.response.emailMessage = `
      Thank you for signing up!<br>
      Please click <a href="https://${domain}/confirm?code=${code}&username=${username}">HERE</a> to confirm your account<br>
      <a href="https://${domain}/confirm?code=${code}&username=${username}">https://${domain}/confirm?code=${code}&username=${username}</a>
    `;
  }

  callback(null, event);
};
