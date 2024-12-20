import React, { useState, useContext } from 'react';
import "./login.css"
import ProfilePage from "../userProfile/Profile"
import ShowContext from '../../index';
import { useTranslation} from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Label , FormGroup, Input, Col, Form, Row  } from 'reactstrap';
const AdminLogin = () => {
  const { t } = useTranslation();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setChooseRecord, login, setLogin} = useContext(ShowContext);
const navigate = useNavigate()
  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:5000/login-user", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",

      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {

        if (data.status == "ok") {
          alert("login successful");
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("loggedIn", true);
          window.localStorage.setItem("useremail", email);
          fetch(`http://localhost:5000/getP/${email}`, {
            method: "GET",
            crossDomain: true,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",

            },
          })
            .then((res) => res.json())
            .then((data) => {
              setChooseRecord(data);
              setLogin(true)
              navigate("/profile/");
            });

          
        }
      });
  }
  return (
    <>
    {login?  <ProfilePage />  : <div className='form'>        
    <Form>
    <h4>{t("logtoAdminBoard")}</h4>
<Row>
  <Col md={6}>
    <FormGroup>
      <Input
        id="exampleEmail"
        name="email"
        placeholder={t("email")}
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
                <Input
        id="examplePassword"
        name="password"
        placeholder={t("PW")}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
    </FormGroup>
    <FormGroup>
                <Input
        id="examplePassword"
        name="check"
        placeholder={t("customContact")}
        type="checkbox"
      />
          <Label for="check">
          {t("autoLogin")}
    </Label>
    </FormGroup>
  </Col>
</Row>
<Button onClick={handleSubmit}style={{backgroundColor: "black", color: "rgb(170, 170, 170)", }}>
{t("adminlogin")}
</Button>
<Button style={{backgroundColor: "rgb(170, 170, 170)", color: "white"}}>
<Link
                    to="/register/"
                    style={{ textDecoration: "none", color: "white" }}
                  >{t("newUser")}</Link>
</Button>
</Form>
<div className="forgetPW">
<span>{t("forgetPW")}</span>
<span><Link
                    to="/login/"
                    style={{ textDecoration: "none", color: "black" }}
                  >{t("userlogin")}</Link></span>
</div>
</div>}

</>
  )
}

export default AdminLogin