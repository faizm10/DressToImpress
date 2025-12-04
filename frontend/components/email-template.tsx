import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  rentalStartDate: string;
  rentalEndDate: string;
  pickupDate: string;
  email: string;
}

const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  rentalStartDate,
  rentalEndDate,
  pickupDate,
  email,
}) => (
  <div style={{ fontFamily: "sans-serif", lineHeight: 1.5, color: "#333" }}>
    <p>Hi {firstName},</p>

    <p>
      Thank you for submitting your clothing rental request through the Dress to
      Impress program. We're pleased to confirm that your rental has been
      approved for:{" "}
      <strong>
        {rentalStartDate} to {rentalEndDate}
      </strong>
      .
    </p>

    <p>
      Your selected item(s) will be ready for pick-up at the Business Career
      Development Centre (MACS 101) on <strong>{pickupDate}</strong>. If this
      date does not work for you, please contact{" "}
      <a href="mailto:langcareers@uoguelph.ca">langcareers@uoguelph.ca</a>. The
      BCDC is open from 8:30 am-4:30 pm. Please bring your phone # with you
      when picking up your item(s).
    </p>

    <p>
      When you are done with your item(s), please return your rental no later
      than one week after your rental end date. (If you need to extend your
      rental, contact the BCDC.) There’s no need to dry-clean your item(s);
      we’ll take care of that to have them ready for the next student.
    </p>

    <p>
      If you have any questions or need to adjust your rental, feel free to
      reach out at{" "}
      <a href="mailto:langcareers@uoguelph.ca">langcareers@uoguelph.ca</a>.
    </p>

    <p>Regards,</p>

    <p style={{ marginBottom: 0 }}>
      Business Career Development Centre
      <br />
      Gordon S. Lang School of Business | University of Guelph
      <br />
      MacDonald Stewart Hall (RM101)
      <br />
      519-824-4120 Ext. 56346 |{" "}
      <a href="mailto:langcareers@uoguelph.ca">langcareers@uoguelph.ca</a>
    </p>
  </div>
);

export default EmailTemplate;
