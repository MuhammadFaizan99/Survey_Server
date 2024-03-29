const { google } = require("googleapis");

// These id's and secrets should come from .env file.
const CLIENT_ID = "1014630152515-9ba1u0th3406d3n2b07280bohv1co6r4.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04NvktLe8ZEnCCgYIARAAGAQSNwF-L9IrH8PbJQmy0xNF_qX-6ToCoKS1LVEN5LG-Mdai21Ua6OKFfulLL-pUi9xt7m-DBHCUxcY";

// Create an OAuth2 client with the credentials
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Function to refresh access token
const refreshAccessToken = async () => {
  try {
    const { tokens } = await oAuth2Client.refreshToken(REFRESH_TOKEN);
    oAuth2Client.setCredentials(tokens);
    console.log("Access token refreshed successfully");
    return tokens.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

// Set initial credentials
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
    let accessToken = await oAuth2Client.getAccessToken();

    // If access token is expired, refresh it
    if (accessToken.expiry_date <= Date.now()) {
      accessToken = await refreshAccessToken();
    }

    // Send the email using the Gmail API
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: Buffer.from(
          `Subject: Survey Form Submission\nTo: augmentationagency@gmail.com\nContent-Type: text/html; charset=utf-8\n\n${emailContent}`
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
