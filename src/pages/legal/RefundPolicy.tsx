import LegalLayout from "./LegalLayout";

const RefundPolicy = () => (
  <LegalLayout title="Refund & Cancellation Policy">
    <p>
      We want you to be fully satisfied with every purchase from MStar Mobile. Please read the
      conditions below carefully before placing an order or requesting a return.
    </p>

    <h2>1. Order Cancellation</h2>
    <ul>
      <li>Orders can be cancelled <strong>only before they are shipped</strong>.</li>
      <li>Once an order has been handed over to the courier, it cannot be cancelled.</li>
      <li>To cancel an order in time, please contact us as soon as possible on WhatsApp / phone.</li>
    </ul>

    <h2>2. Returns & Replacements</h2>
    <ul>
      <li>Sealed, unopened products can be returned within <strong>7 days</strong> of delivery if
        the packaging is intact and original.</li>
      <li>Opened or used products generally do <strong>not</strong> qualify for return.</li>
      <li>Defective or damaged products will be reviewed for <strong>replacement</strong> after
        inspection. Please share clear photos/videos of the issue within 48 hours of delivery.</li>
      <li>Replacements are subject to stock availability; if a replacement is not possible, we
        will issue a refund.</li>
    </ul>

    <h2>3. Refund Timelines</h2>
    <ul>
      <li>Approved refunds are initiated within <strong>3–5 business days</strong> of pickup or
        product inspection.</li>
      <li>Once initiated, the amount is credited back to the original payment method as per the
        bank/payment-gateway timeline (typically 5–7 business days).</li>
    </ul>

    <h2>4. When a Refund May Be Rejected</h2>
    <ul>
      <li>Item shows signs of physical damage, misuse, or unauthorised repair.</li>
      <li>Original packaging, accessories, manuals, or invoices are missing.</li>
      <li>Return request is raised after the eligible return window.</li>
      <li>Item is a clearance, no-return, or final-sale product (clearly marked at purchase).</li>
    </ul>

    <h2>5. How to Request</h2>
    <p>
      Email <a href="mailto:mstarmobile77@gmail.com" className="text-accent">mstarmobile77@gmail.com</a> or
      message us on WhatsApp with your order ID and a brief description of the issue.
    </p>
  </LegalLayout>
);

export default RefundPolicy;