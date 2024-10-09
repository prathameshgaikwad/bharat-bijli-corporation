package com.prathameshShubham.bharatBijliCorporation.services;

import com.prathameshShubham.bharatBijliCorporation.models.Invoice;
import com.prathameshShubham.bharatBijliCorporation.models.PersonalDetails;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendUserIdWithEmail(String email, String Id) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your Generated Username : ");
        message.setText("Account is successfully created\n");
        message.setText("Your UserName is : " + Id);

        javaMailSender.send(message);
    }

    public void sendInvoiceEmail(Invoice invoice) throws MessagingException {

        String email  = invoice.getCustomer().getPersonalDetails().getEmailId();
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        MimeMessageHelper message = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        message.setTo(email);
        message.setSubject("Invoice for this month");

        String emailContent = invoiceEmailContent(invoice);
        message.setText(emailContent, true);

        javaMailSender.send(mimeMessage);
    }

    public void updationEmail(PersonalDetails updatedDetails) throws MessagingException {
        String to = updatedDetails.getEmailId();
        String subject = "Your Personal Details have been Updated";
        String body = buildUpdateEmailBody(updatedDetails);

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true);
        javaMailSender.send(mimeMessage);
    }

    public String invoiceEmailContent(Invoice invoice){
        double unitRate = invoice.getUnitsConsumed();
        double totalAmount = invoice.getUnitsConsumed() * unitRate;
        double earlyPaymentDiscount = 0.05 * totalAmount;
        double onlinePaymentDiscount = 0.05 * totalAmount;
        double totalWithDiscounts = totalAmount - earlyPaymentDiscount;
        double bothDiscountApplied = totalWithDiscounts - (totalWithDiscounts)*0.05;

        return
                "<html>" +
                        "<body style='font-family: Arial, sans-serif;'>" +
                        "<h2 style='color: #2E86C1;'>Dear Customer,</h2>" +
                        "<p>Please find below the details of your invoice for this month:</p>" +
                        "<table border='1' cellpadding='10' cellspacing='0' style='border-collapse: collapse; width: 100%;'>" +
                        "<tr><th>Units Consumed</th><td>" + invoice.getUnitsConsumed() + "</td></tr>" +
                        "<tr><th>Tariff (per 1 Kw)</th><td>" + invoice.getTariff() + "</td></tr>" +
                        "<tr><th>Total Amount</th><td>Rs. " + String.format("%.2f", totalAmount) + "</td></tr>" +
                        "<tr><th>Period Start Date</th><td>" + invoice.getPeriodStartDate() + "</td></tr>" +
                        "<tr><th>Period End Date</th><td>" + invoice.getPeriodEndDate() + "</td></tr>" +
                        "<tr><th>Due Date</th><td>" + invoice.getDueDate() + "</td></tr>" +
                        "<tr><th>Customer ID</th><td>" + invoice.getCustomer().getId() + "</td></tr>" +
                        "</table>" +
                        "<h3>Discounts:</h3>" +
                        "<ul>" +
                        "<li>Early payment discount (5% if paid before due date): Rs. " + String.format("%.2f", earlyPaymentDiscount) + "</li>" +
                        "<li>Online payment discount (5% if paid online): Rs. " + String.format("%.2f", onlinePaymentDiscount) + "</li>" +
                        "</ul>" +
                        "<p><strong>Total Amount after Discounts: Rs. " + String.format("%.2f", bothDiscountApplied) + "</strong></p>" +
                        "<p>Thank you for your business!</p>" +
                        "<p style='color: #2E86C1;'>Best regards,<br> <h3>BBC</h3></p>" +
                        "<p><strong>Employee Generated:</strong> " + invoice.getGeneratedByEmployee().getPersonalDetails().getFirstName() +  " " + invoice.getGeneratedByEmployee().getPersonalDetails().getLastName() + "</p>" +
                        "</body>" +
                        "</html>";

    }

    private String buildUpdateEmailBody(PersonalDetails personalDetails) {
        return "<html>" +
                "<body style='font-family: Arial, sans-serif;'>" +
                "<h2 style='color: #0b6fc5;'>Your Personal Details Have Been Updated</h2>" +
                "<p>Dear " + personalDetails.getFirstName() + ",</p>" +
                "<p>Your personal details have been successfully updated:</p>" +
                "<table style='border-collapse: collapse; width: 100%; max-width: 600px;'>" +
                "<tr>" +
                "<th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>Field</th>" +
                "<th style='border: 1px solid #dddddd; text-align: left; padding: 8px;'>Updated Value</th>" +
                "</tr>" +
                "<tr>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>First Name</td>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>" + personalDetails.getFirstName() + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>Last Name</td>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>" + personalDetails.getLastName() + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>Email</td>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>" + personalDetails.getEmailId() + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>Phone Number</td>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>" + personalDetails.getPhoneNumber() + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>Address</td>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>" + personalDetails.getAddress() + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>City</td>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>" + personalDetails.getCity() + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>Pincode</td>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>" + personalDetails.getPincode() + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>State</td>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>" + personalDetails.getState() + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>Date of Birth</td>" +
                "<td style='border: 1px solid #dddddd; padding: 8px;'>" + personalDetails.getDateOfBirth() + "</td>" +
                "</tr>" +
                "</table>" +
                "<p>Thank you!</p>" +
                "</body>" +
                "</html>";
    }

}
