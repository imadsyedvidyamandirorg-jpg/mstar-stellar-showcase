import LegalLayout from "./LegalLayout";

const ShippingPolicy = () => (
  <LegalLayout title="Shipping & Delivery Policy">
    <h2>1. Order Processing</h2>
    <ul>
      <li>Orders are processed only after <strong>successful payment confirmation</strong>.</li>
      <li>Orders placed on Sundays or public holidays are processed on the next working day.</li>
    </ul>

    <h2>2. Shipping Method</h2>
    <ul>
      <li>We ship through reputed third-party courier partners across India.</li>
      <li>The choice of courier depends on your delivery pin code and product size.</li>
      <li>For local deliveries within Palanpur, our store team may deliver directly.</li>
    </ul>

    <h2>3. Delivery Timelines</h2>
    <ul>
      <li>Estimated delivery is typically <strong>3–7 business days</strong> from dispatch,
        depending on your location and courier serviceability.</li>
      <li>Remote pin codes may take additional time.</li>
    </ul>

    <h2>4. Order Tracking</h2>
    <ul>
      <li>Once shipped, you will receive an order update with tracking details on your registered
        phone number / email.</li>
      <li>You can also view your orders any time from the <em>Orders</em> page in your account.</li>
    </ul>

    <h2>5. Delays & External Factors</h2>
    <p>
      Once a parcel is handed over to the courier, the actual delivery is managed by the courier
      partner. Delays caused by weather, strikes, regional restrictions, or incorrect/incomplete
      addresses are outside our direct control. We will, however, do our best to follow up with
      the courier and keep you informed.
    </p>

    <h2>6. Failed Deliveries</h2>
    <p>
      If a parcel is returned to us undelivered (wrong address, no response, refused delivery),
      we will contact you to re-arrange shipping; additional shipping charges may apply.
    </p>
  </LegalLayout>
);

export default ShippingPolicy;