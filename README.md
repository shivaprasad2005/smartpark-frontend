# SmartPark — Frontend

> A modern parking slot reservation web app built with React and Vite.  
> Book, pay, and manage parking spots in real-time from one dashboard.

## Screenshots

### Register & Login
![Register]("screenshots/Register.png")
![Login](screenshots/login.png)

### User Dashboard
![Dashboard](screenshots/dashboard.png)

### Browse & Book Slots
![Slots](screenshots/slots.png)

### Booking Summary & Payment
![Booking](screenshots/booking.png)

### My Bookings
![My Bookings](screenshots/mybookings.png)

### Admin Panel
![Admin](screenshots/admin.png)

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **State Management:** React Context API
- **Styling:** Pure CSS (custom dark theme)
- **HTTP Client:** Axios
- **Auth:** JWT stored in localStorage

## Features

- User registration and login
- Protected routes (auth-based navigation)
- Real-time parking slot grid with live availability
- Multi-slot selection with dynamic pricing
- Date, time, and duration-based booking
- Booking confirmation with full summary
- Payment flow with receipt generation
- My Bookings page with cancel option
- Admin Operations Center — manage all slots and bookings
- Fully responsive dark UI

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── SlotGrid.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ParkingSlots.jsx
│   │   ├── ConfirmBooking.jsx
│   │   ├── PaymentPage.jsx
│   │   ├── Receipt.jsx
│   │   ├── MyBookings.jsx
│   │   └── AdminPanel.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── parkingService.js
│   ├── App.jsx
│   └── main.jsx
└── index.html
```

## Setup and Run Locally

### Prerequisites
- Node.js installed
- Backend server running (see backend repo)

### Steps

```bash
# Clone the repository
git clone https://github.com/shivaprasad2005/smartpark-frontend.git

# Navigate into the folder
cd smartpark-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at `http://localhost:5173`

Make sure the backend is running at `http://localhost:5000`

## Backend Repository

The Node.js + Express + MongoDB backend:  
👉 [smartpark-backend](https://github.com/shivaprasad2005/smartpark-backend)

## Developer

**Shiva Prasad D**  
B.E. Information Science and Engineering — Bangalore Institute of Technology  
[GitHub](https://github.com/shivaprasad2005) | [LinkedIn](https://linkedin.com/in/shiva-prasad-d)
