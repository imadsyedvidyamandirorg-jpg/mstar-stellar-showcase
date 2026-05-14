import LegalLayout from "./LegalLayout";

const TermsConditions = () => (
  <LegalLayout title="Terms & Conditions">
    <p>
      By accessing or using the MStar Mobile website and placing orders through it, you agree to
      the following terms. Please read them carefully.
    </p>

    <h2>1. About Us</h2>
    <p>
      MStar Mobile is a retail store based in Palanpur, Gujarat, selling premium consumer
      electronics, mobile accessories, audio products, and smart gadgets. The website allows
      customers to browse our catalog and place online orders.
    </p>

    <h2>2. Pricing</h2>
    <ul>
      <li>All prices are listed in Indian Rupees (₹) and include applicable taxes unless stated otherwise.</li>
      <li>Prices may change without prior notice; the price applicable to your order is the price displayed at the time of checkout.</li>
      <li>In the rare case of an obvious pricing error, we reserve the right to cancel the order and refund any amount paid.</li>
    </ul>

    <h2>3. Product Information</h2>
    <p>
      We do our best to describe products accurately, including images, specifications, and stock
      status. Minor variations in colour, packaging, or appearance may occur due to manufacturer
      updates or display differences and do not constitute a defect.
    </p>

    <h2>4. User Responsibilities</h2>
    <ul>
      <li>Provide accurate account, delivery, and contact information.</li>
      <li>Do not misuse the website (no scraping, hacking, fraudulent orders, or abusive content).</li>
      <li>Keep your login credentials confidential. You are responsible for activity under your account.</li>
    </ul>

    <h2>5. Payments</h2>
    <ul>
      <li>Online payments are processed through secure, PCI-DSS compliant payment gateways.</li>
      <li>An order is confirmed only after the payment is successfully received.</li>
      <li>If a payment is debited but the order is not confirmed, please contact us with the transaction ID — refunds in such cases are processed by the payment gateway as per their timelines.</li>
    </ul>

    <h2>6. Order Approval</h2>
    <p>
      We reserve the right to accept or reject any order at our discretion — for example, in case
      of stock unavailability, suspected fraud, undeliverable address, or pricing errors. If an
      order is rejected after payment, the full amount will be refunded.
    </p>

    <h2>7. Liability</h2>
    <p>
      To the maximum extent permitted by law, MStar Mobile's total liability for any claim
      arising out of an order is limited to the amount paid for that order. We are not liable for
      indirect or consequential losses, manufacturer warranty claims (which are governed by the
      respective brand), or delays caused by third-party couriers.
    </p>

    <h2>8. Intellectual Property</h2>
    <p>
      All trademarks, logos, product images, and brand names belong to their respective owners
      and are used only to describe the products we sell.
    </p>

    <h2>9. Governing Law</h2>
    <p>
      These terms are governed by the laws of India. Any dispute will be subject to the exclusive
      jurisdiction of the courts at Palanpur, Gujarat.
    </p>

    <h2>10. Contact</h2>
    <p>
      Questions about these terms? Email us at <a href="mailto:mstarmobile77@gmail.com" className="text-accent">mstarmobile77@gmail.com</a>.
    </p>
  </LegalLayout>
);

export default TermsConditions;