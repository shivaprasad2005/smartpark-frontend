import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';

function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { slots, startTime, duration, amount } = state;

  return (
    <div className="payment-page">
      <h1>Scan & Pay</h1>

      <h3>Slots:</h3>
      {slots.map(s => <p key={s._id}>{s.slotNumber}</p>)}

      <h2>Total Amount: ₹{amount}</h2>

      <img src="/phonepe-qr.png" alt="QR" className="qr" />

      <button onClick={() =>
        navigate('/confirm-booking', { state })
      }>
        I Have Paid ✅
      </button>
    </div>
  );
}

export default PaymentPage;