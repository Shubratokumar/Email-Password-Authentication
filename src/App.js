import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import app from "./firebase.init";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";

const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [success, setSuccess] = useState("");
  const [login, setLogin] = useState("");
  const [name, setName] = useState("");

  const handleNameBlur = (e) =>{
    setName(e.target.value);
  }
  const handleEmailBlur = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordBlur = (e) => {
    setPassword(e.target.value);
  };

  const handleRegisteredChange = (e) => {
    setRegistered(e.target.checked);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError("Password should contain at least one special character !!!");
      return;
    }
    setValidated(true);
    setError("");

    if (!registered) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          console.log(user);
          verifyEmail();
          setUserName();
          setSuccess("Registered successfully!!!");
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
          setSuccess("");
        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          const user = result.user;
          setEmail("");
          setPassword("");
          console.log(user);
          setLogin("Successfully Log In !!!");
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
          setLogin("");
        });
    }
    event.preventDefault();
  };

  const setUserName = () =>{
    updateProfile(auth.currentUser, {
      displayName : name
    })
    .then(() => {
      console.log("Updating User Name")
    })
    .catch(error => {
      console.error(error)
    })
  }
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
    .then(() => {
      console.log("email verification send");
    })
    .catch(error => {
      console.error(error)
    })
  };
  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Password reset email sent!");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <div className="registration w-50 mx-auto mt-5 ">
        <h2 className="text-info">
          Please {registered ? "Login" : "Register"} !!!{" "}
        </h2>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          { !registered && <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Your Name</Form.Label>
            <Form.Control
              required
              onBlur={handleNameBlur}
              type="text"
              placeholder="Enter Your Name"
            />
            <Form.Control.Feedback type="invalid">
              Please provide your name.
            </Form.Control.Feedback>
          </Form.Group> }
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              required
              onBlur={handleEmailBlur}
              type="email"
              placeholder="Enter email"
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              onBlur={handlePasswordBlur}
              type="password"
              placeholder="Password"
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              onChange={handleRegisteredChange}
              type="checkbox"
              label="Already registered?"
            />
          </Form.Group>
          <p className="text-success">{success}</p>
          <p className="text-info">{login}</p>
          <p className="text-danger">{error}</p>
          <Button className="mb-3" onClick={handlePasswordReset} variant="link">
            Forget Password?
          </Button>
          <br />
          <Button variant="primary" type="submit">
            {registered ? "Login" : "Register"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
