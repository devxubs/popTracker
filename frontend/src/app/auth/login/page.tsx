"use client";

import Loader from "@/components/common/Loader";
import { decryptPassword, encryptPassword } from "@/lib/cryptoHelper";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Form = () => {
   const router = useRouter();
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const [isLoggedIn, setIsLoggedIn] = useState(false);

   const users = [
      {
         username: "devxub",
         password: encryptPassword("pop.tracker.devxub"),
      },
      {
         username: "siam",
         password: encryptPassword("pop.tracker.siam"),
      },
      {
         username: "demo",
         password: encryptPassword("demo"),
      },
   ];

   useEffect(() => {
      const user = sessionStorage.getItem("user");

      if (user) {
         setIsLoggedIn(true);
      }
   }, []);

   const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const user = users.find(
         (item) =>
            item.username.toLowerCase() === username.toLowerCase() &&
            decryptPassword(item.password) === password,
      );

      if (!user) {
         setError("Invalid Username or Password");
         return;
      }

      sessionStorage.setItem(
         "user",
         JSON.stringify({
            username: user.username,
         }),
      );

      setError("");
      setIsLoggedIn(true);
   };

   const handleLogout = () => {
      sessionStorage.removeItem("user");
      setIsLoggedIn(false);
   };

   if (isLoggedIn) {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");

      setTimeout(() => {
         router.push("/admin/dashboard");
      }, 2000);

      return (
         <StyledWrapper>
            <div className="main">
               <Loader />

               <div
                  style={{
                     color: "#fff",
                     textAlign: "center",
                  }}
               >
                  <h1>Welcome {user.username}</h1>
               </div>
            </div>
         </StyledWrapper>
      );
   }

   return (
      <StyledWrapper>
         {/* <div className="main">
            <form className="form" onSubmit={handleLogin}>
               <p id="heading">Login</p>
               <div className="field">
                  <svg
                     className="input-icon"
                     xmlns="http://www.w3.org/2000/svg"
                     width={16}
                     height={16}
                     fill="currentColor"
                     viewBox="0 0 16 16"
                  >
                     <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" />
                  </svg>
                  <input
                     autoComplete="off"
                     placeholder="Username"
                     className="input-field"
                     type="text"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                  />
               </div>
               <div className="field">
                  <svg
                     className="input-icon"
                     xmlns="http://www.w3.org/2000/svg"
                     width={16}
                     height={16}
                     fill="currentColor"
                     viewBox="0 0 16 16"
                  >
                     <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                  </svg>
                  <input
                     placeholder="Password"
                     className="input-field"
                     // type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />
               </div>
               <div className="btn">
                  <button className="button1">
                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Login&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </button>
               </div>
               {error && (
                  <p
                     style={{
                        color: "#ff4d4f",
                        textAlign: "center",
                        marginTop: "10px",
                     }}
                  >
                     {error}
                  </p>
               )}
            </form>
         </div> */}
         <div className="main">
            <form className="form" onSubmit={handleLogin}>
               <span className="input-span">
                  <label htmlFor="email" className="label">
                     Email
                  </label>
                  <input
                     type="text"
                     name="email"
                     id="email"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                  />
               </span>
               <span className="input-span">
                  <label htmlFor="password" className="label">
                     Password
                  </label>
                  <input
                     type="password"
                     name="password"
                     id="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />
               </span>

               <input className="submit" type="submit" defaultValue="Log in" />
               {error && (
                  <p
                     style={{
                        color: "#ff4d4f",
                        textAlign: "center",
                        marginTop: "10px",
                     }}
                  >
                     {error}
                  </p>
               )}
            </form>
         </div>
      </StyledWrapper>
   );
};

const StyledWrapper = styled.div`
   .main {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
   }

   .form {
      --bg-light: #efefef;
      --bg-dark: #707070;
      --clr: #58bc82;
      --clr-alpha: #9c9c9c60;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      width: 100%;
      max-width: 300px;
   }

   .form .input-span {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
   }

   .form input[type="text"],
   .form input[type="password"] {
      border-radius: 0.5rem;
      padding: 1rem 0.75rem;
      width: 100%;
      border: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: var(--clr-alpha);
      outline: 2px solid var(--bg-dark);
   }

   .form input[type="text"]:focus,
   .form input[type="password"]:focus {
      outline: 2px solid var(--clr);
   }

   .label {
      align-self: flex-start;
      color: var(--clr);
      font-weight: 600;
   }

   .form .submit {
      padding: 1rem 0.75rem;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-radius: 3rem;
      background-color: var(--bg-dark);
      color: var(--bg-light);
      border: none;
      cursor: pointer;
      transition: all 300ms;
      font-weight: 600;
      font-size: 0.9rem;
   }

   .form .submit:hover {
      background-color: var(--clr);
      color: var(--bg-dark);
   }

   .span {
      text-decoration: none;
      color: var(--bg-dark);
   }

   .span a {
      color: var(--clr);
   }
`;

export default Form;
