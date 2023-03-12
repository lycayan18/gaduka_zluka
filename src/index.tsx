import React from "react";
import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import App from "./app";
import MainPage from "./components/main-page";
import ErrorElement from "./components/error-element";
import AnonChat from "./components/chat/anon";
import AnonRandChat from "./components/chat/anon-rand";
import AuthChat from "./components/chat/auth";
import LoginPage from "./components/login-register-page/login";
import RegisterPage from "./components/login-register-page/register";
import Gaduka from "./gaduka";
import SocketTransmitter from "./transmitters/socket-transmitter"

// FIXME: Remove this
const address = localStorage.getItem("address");

const gaduka = new Gaduka(address !== null ? new SocketTransmitter(address) : new SocketTransmitter());

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
                path: "anon",
                element: <AnonChat gaduka={gaduka} />
            },
            {
                path: "auth",
                element: <AuthChat gaduka={gaduka} />
            },
            {
                path: "anon/rand",
                element: <AnonRandChat gaduka={gaduka} />
            }
        ]
    }
]);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);