import LegalLayout from "./LegalLayout";

const PrivacyPolicy = () => (
  <LegalLayout title="Privacy Policy">
    <p>
      MStar Mobile ("we", "us", "our") respects your privacy and is committed to protecting the
      personal information you share with us when you use our website, place an order, or contact
      our store. This policy explains what we collect, how we use it, and the choices you have.
    </p>

    <h2>1. Information We Collect</h2>
    <ul>
      <li><strong>Account details</strong> — name, email, phone number, and password (stored securely) when you sign up.</li>
      <li><strong>Order details</strong> — products you buy, delivery address, and contact information.</li>
      <li><strong>Payment information</strong> — processed by our payment partner (Razorpay). We do not store full card numbers, CVV, or UPI PINs on our servers.</li>
      <li><strong>Usage data</strong> — basic analytics such as pages visited and device type, used to improve the website.</li>
    </ul>

    <h2>2. How We Use Your Information</h2>
    <ul>
      <li>To process and deliver your orders.</li>
      <li>To provide order updates, invoices, and customer support.</li>
      <li>To improve product listings, performance, and security of the website.</li>
      <li>To send important notices about your account or purchases.</li>
    </ul>

    <h2>3. Payment Security</h2>
    <p>
      All online payments are handled by PCI-DSS compliant payment gateways. Sensitive payment data
      is transmitted directly to the payment provider over an encrypted (HTTPS) connection and is
      not visible to MStar Mobile.
    </p>

    <h2>4. Cookies & Analytics</h2>
    <p>
      We use a small number of cookies and basic analytics to keep you signed in, remember your
      cart, and understand how visitors use the site. You can clear or block cookies in your
      browser settings; some features (like cart and login) may not work without them.
    </p>

    <h2>5. Sharing of Information</h2>
    <p>
      We do not sell your personal information. We share it only with trusted service providers
      who help us run the business — for example, the payment gateway, courier partners for
      delivery, and email/SMS providers for order updates — and only to the extent required to
      complete your order.
    </p>

    <h2>6. Your Rights</h2>
    <ul>
      <li>Request a copy of the personal information we hold about you.</li>
      <li>Ask us to correct or update inaccurate details.</li>
      <li>Request deletion of your account, subject to legal record-keeping requirements.</li>
    </ul>

    <h2>7. Data Retention</h2>
    <p>
      Order and invoice records are retained for the period required under applicable Indian tax
      and consumer-protection laws. Account data is retained while your account is active.
    </p>

    <h2>8. Contact Us</h2>
    <p>
      For any privacy-related questions, write to us at <a href="mailto:mstarmobile77@gmail.com" className="text-accent">mstarmobile77@gmail.com</a> or
      visit our store at R.D Complex, Opp. Sukhadia Sweet Mart, Near Janta Kachori, Moti Bazar,
      Palanpur — 385001, Gujarat, India.
    </p>
  </LegalLayout>
);

export default PrivacyPolicy;