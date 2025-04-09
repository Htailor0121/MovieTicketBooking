# Movie Booking System

A full-stack web application for booking movie tickets online. Built with React.js for the frontend and Python Flask for the backend.

## Features

- User Authentication (Login/Register)
- Movie Browsing and Search
- Seat Selection
- Ticket Booking
- Booking History
- Admin Dashboard
  - User Management
  - Movie Management
  - Booking Management
- Contact Form
- Responsive Design

## Tech Stack

### Frontend
- React.js
- Material-UI
- React Router
- Axios

### Backend
- Python Flask
- SQLAlchemy
- Flask-Mail
- JWT Authentication

## Setup Instructions

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server:
   ```bash
   python main.py
   ```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

## Screenshots

[Add screenshots of your application here]

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 