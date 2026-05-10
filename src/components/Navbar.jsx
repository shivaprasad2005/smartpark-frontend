import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
	const navigate = useNavigate();

	return (
		<div className="navbar">
			<h2 onClick={() => navigate('/dashboard')}>🚗 Parking</h2>

			<div>
				<button onClick={() => navigate('/slots')}>Slots</button>
				<button onClick={() => navigate('/bookings')}>Bookings</button>
			</div>
		</div>
	);
}

export default Navbar;