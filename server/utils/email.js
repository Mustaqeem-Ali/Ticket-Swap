// utils/email.js
import nodemailer from 'nodemailer';
import qrcode from 'qrcode';

// Function to create and configure the email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure:false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// --- Helper function to generate dynamic ticket details for the email body ---
const generateTicketDetailsHtml = (ticket) => {
  const { category, details, date } = ticket;
  let detailsHtml = `<p><strong>Date:</strong> ${new Date(date).toLocaleString()}</p>`;

  if (['flight', 'bus', 'train'].includes(category)) {
    detailsHtml += `
      <p><strong>From:</strong> ${details.source || 'N/A'}</p>
      <p><strong>To:</strong> ${details.destination || 'N/A'}</p>
      <p><strong>Train/Flight No:</strong> ${details.trainName || details.flightCode || 'N/A'}</p>
    `;
  } else if (['movie', 'concert', 'event'].includes(category)) {
    detailsHtml += `
      <p><strong>Event:</strong> ${details.title || 'N/A'}</p>
      <p><strong>Location:</strong> ${details.location || 'N/A'}</p>
      <p><strong>Seat:</strong> ${details.seat || 'N/A'}</p>
    `;
  }
  return detailsHtml;
};


// --- Main function to send the ticket confirmation email to the BUYER ---
export const sendTicketConfirmation = async (user, ticket, order) => {
  try {
    // 1. Generate QR Code using the unique Order ID for verification
    const qrCodeDataURL = await qrcode.toDataURL(order.id);
    const ticketDetailsHtml = generateTicketDetailsHtml(ticket);
    const ticketTitle = ticket.details.title || `${ticket.details.source} to ${ticket.details.destination}`;

    // 2. Create the HTML content for the email
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
              .container { border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto; border-radius: 8px; }
              .header { font-size: 24px; font-weight: bold; color: #4CAF50; }
              .ticket-details { margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px; }
              .ticket-details h3 { margin-top: 0; }
              .qr-code { text-align: center; margin-top: 20px; }
              .footer { margin-top: 30px; font-size: 14px; color: #777; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">Your Ticket is Confirmed!</div>
              <p>Hi ${user.name},</p>
              <p>Thank you for your purchase. Here are the details of your ticket:</p>
              
              <div class="ticket-details">
                  <h3>Your Ticket Details</h3>
                  <p><strong>Category:</strong> ${ticket.category}</p>
                  ${ticketDetailsHtml}
                  <p><strong>Price Paid:</strong> ₹${order.purchasePrice.toFixed(2)}</p>
              </div>
              
              <div class="qr-code">
                  <h3>Your QR Code</h3>
                  <p>Use this code for verification.</p>
                  <img src="${qrCodeDataURL}" alt="Ticket QR Code">
                  <p><small>Order ID: ${order.id}</small></p>
              </div>

              <div class="footer">
                  <p>Best regards,<br>The Ticket Swap Team</p>
              </div>
          </div>
      </body>
      </html>
    `;

    // 3. Define and send email
    await createTransporter().sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Your Ticket Confirmation for: ${ticketTitle}`,
      html: htmlContent,
    });
    console.log(`Confirmation email sent successfully to ${user.email}.`);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};


// --- Main function to send the payout confirmation email to the SELLER ---
export const sendPayoutConfirmation = async (seller, order, payoutAmount, commission) => {
  try {
    // Use the ticketSnapshot from the order for reliable historical data
    const ticketTitle = order.ticketSnapshot.details.title || `${order.ticketSnapshot.details.source} to ${order.ticketSnapshot.details.destination}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
        <h2>Payout Processed!</h2>
        <p>Hi ${seller.name},</p>
        <p>Great news! Your ticket for <strong>${ticketTitle}</strong> has been sold and we've processed your payout.</p>
        <hr>
        <h3>Payout Summary:</h3>
        <p>Ticket Sale Price: ₹${order.purchasePrice.toFixed(2)}</p>
        <p>Platform Fee: - ₹${commission.toFixed(2)}</p>
        <p><strong>Amount Credited: ₹${payoutAmount.toFixed(2)}</strong></p>
        <hr>
        <p>The amount has been sent to your registered account.</p>
        <p>Thank you for using our platform!</p>
      </div>
    `;

    await createTransporter().sendMail({
      from: process.env.EMAIL_FROM,
      to: seller.email,
      subject: `Your Payout for Ticket: ${ticketTitle}`,
      html: htmlContent,
    });
    console.log(`Payout confirmation email sent successfully to ${seller.email}.`);
  } catch (error) {
    console.error('Error sending payout confirmation email:', error);
  }
};