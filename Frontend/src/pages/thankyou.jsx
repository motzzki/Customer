import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  const submitAnotherResponse = () =>{
    sessionStorage.clear();
    navigate('/')
  }

  return (
    <div>
      {/* Inline styles using <style> tag */}
      <style>
        {`
          body, html {
            height: 100%;
            margin: 0;
          }

          .thankyou-container {
            background: #edf3fc; /* Light blue background */
            height: 100vh; /* Full height of the viewport */
            display: flex; /* Flexbox for centering content */
            justify-content: center; /* Center horizontally */
            align-items: center; /* Center vertically */
            margin: 0; /* Remove default margin */
            padding: 0; /* Ensure no padding on the body */
          }

          /* Importing Google Fonts for a more modern font style */
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

          .thankyou-card {
            background: #ffffff;
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            border: none;
            display: flex;
            flex-direction: column;
            justify-content: space-between; /* Ensure space between elements */
            height: 100%; /* Make the card take the full height of its container */
            position: relative;
          }

          .thankyou-title {
            color: #00796b;
            font-family: 'Poppins', sans-serif; /* Using Poppins font */
            font-weight: 600; /* Medium weight for title */
            letter-spacing: 2px;
            font-size: 3rem;
            text-align: center; /* Center the title text */
            margin-bottom: 1rem; /* Add some space below the title */
          }

          .thankyou-message {
            font-size: 1.1rem;
            color: #607d8b;
            font-style: italic;
            margin-bottom: 2rem;
            text-align: center; /* Center the message text */
          }

          /* Centered "Back to Home" Button inside the card and push it to the bottom */
         .thankyou-btn {
            background-color: #00796b;
            border-color: #00796b;
            font-size: 1rem; /* Smaller font size */
            padding: 0.5rem 2rem; /* Moderate padding */
            border-radius: 50px;
            display: flex; /* Center the button horizontally */
            margin-top: auto; /* Push the button to the bottom of the card */
            transition: background-color 0.3s ease;
            text-align: center; /* Center the text inside the button */
            justify-content: center; /* Ensure the content is centered horizontally */
            align-items: center; /* Center content vertically if the button has more height */
}
          .thankyou-btn:hover {
            background-color: #004d40;
            border-color: #004d40;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>

      <div className="thankyou-container">
        <Container>
          <Row className="justify-content-center">
            <Col md={6} sm={12}>
              <Card className="thankyou-card">
                <Card.Body>
                  <Card.Title className="thankyou-title">Thank You!</Card.Title>
                  <Card.Text className="thankyou-message">
                    Your submission has been successfully received. We will get back to you as soon as possible.
                  </Card.Text>
                  {/* Centered "Back to Home" Button inside the card */}
                  <Button variant="primary" onClick={submitAnotherResponse} className="thankyou-btn">
                    Submit another response
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default ThankYou;
