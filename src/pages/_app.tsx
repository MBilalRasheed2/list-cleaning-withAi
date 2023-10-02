import React from "react";
import {ToastProvider} from "../utils/toastContext";
import type {AppProps} from "next/app";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";
import Modal from "react-modal";
import {ToastContainer} from "react-toastify";

// Set the app element to hide it from screen readers when the modal is open
if (typeof window !== "undefined") {
  Modal.setAppElement("#__next");
}
export default function App({Component, pageProps}: AppProps) {
  return (
    <ToastProvider>
      <Component {...pageProps} />
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ToastProvider>
  );
}
