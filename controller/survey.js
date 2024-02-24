const { google } = require("googleapis");

// These id's and secrets should come from .env file.
const CLIENT_ID = process.env.OAUTH_CLIENTID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REDIRECT_URI = process.env.OAUTH_REDIRECT_URI;
const REFRESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;

// Create an OAuth2 client with the credentials
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Create a Gmail API instance
const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

const mailSurveyForm = async (req, res) => {
  // Extract survey data from the request body
  const {
    homeOwner,
    homeSize,
    scopeOfProject,
    roofInstallation,
    address,
    firstName,
    lastName,
    email,
    phone,
  } = req.body;

  // Create the email message
  const emailContent = `
      <p><strong>Home Owner:</strong> ${homeOwner}</p>
      <p><strong>Home Size:</strong> ${homeSize}</p>
      <p><strong>Scope of Project:</strong> ${scopeOfProject}</p>
      <p><strong>Roof Installation:</strong> ${roofInstallation}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
  `;

  try {
    const accessToken = await oAuth2Client.getAccessToken();

    // Send the email using the Gmail API
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: Buffer.from(
          `Subject: Survey Form Submission\nTo: ${process.env.DESTINATION_EMAIL}\nContent-Type: text/html; charset=utf-8\n\n${emailContent}`
        ).toString("base64"),
      },
    });

    console.log("Email sent:", response.data);
    res.status(200).json({ message: "Survey form submitted successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending survey data via email" });
  }
};

module.exports = { mailSurveyForm };