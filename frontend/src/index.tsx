import React from "react";
import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import App from "./app";
import MainPage from "./pages/main-page";
import ErrorElement from "./components/error-element";
import AnonChat from "./components/chat/anon";
import RandChat from "./components/chat/rand";
import AuthChat from "./components/chat/auth";
import LoginPage from "./pages/login-register-page/login";
import RegisterPage from "./pages/login-register-page/register";
import AdminPage from "./pages/admin-page";
import Gaduka from "./gaduka";
import SocketTransmitter from "./transmitters/socket-transmitter";

// FIXME: Remove this
const address = localStorage.getItem("address");

const gaduka = new Gaduka(address !== null ? new SocketTransmitter(address) : new SocketTransmitter());

// Generate admin page url so that noone could read it from sources
const adminPageUrl = '/' + (parseInt(Math.SQRT1_2.toString().slice(2)).toString(32) + Math.PI.toString(32).slice(2));

const root = createRoot(document.getElementById("root") as HTMLDivElement);

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage gaduka={gaduka} />,
        errorElement: <ErrorElement />
    },
    {
        path: "/register",
        element: <RegisterPage gaduka={gaduka} />,
        errorElement: <ErrorElement />
    },
    {
        path: "/",
        element: <App gaduka={gaduka} />,
        errorElement: <ErrorElement />,
        children: [
            {
                path: "",
                element: <MainPage />
            },
            {
                path: adminPageUrl,
                element: <AdminPage gaduka={gaduka} />,
                errorElement: <ErrorElement />
            },
            {
                path: "anon",
                element: <AnonChat gaduka={gaduka} />
            },
            {
                path: "auth",
                element: <AuthChat gaduka={gaduka} />
            },
            {
                path: "anon/rand",
                element: <RandChat gaduka={gaduka} branch="/anon/rand" key={0} />
            },
            {
                path: "auth/rand",
                element: <RandChat gaduka={gaduka} branch="/auth/rand" key={1} />
            }
        ]
    }
]);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);