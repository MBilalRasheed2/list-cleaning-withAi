"use client";
import Modal from "react-modal";
import {Elements} from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutForm";
import {loadStripe} from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51LXSmjAaD16bXEq9Te7kHHAv79uPT1Cjb6sVFiodePNjSxHzNDfbg2okXVK4A6jew6zdfQTLMMbuzqcLDW7kSEYD0054yVgemi"
);

export default function Payment(props: any) {
  const {amount, email, file, name} = props;

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      boxShadow:
        "rgba(0, 0, 0, 0.15) 0px 10px 16px 4px, rgba(0, 0, 0, 0.1) 4px -7px 16px 1px",
      width: "400px",
      border: "none",
    },
  };

  return (
    <div>
      <Modal
        style={customStyles}
        isOpen={props.showModal}
        onRequestClose={props.handleCloseModal}
      >
        <Elements stripe={stripePromise}>
          <CheckoutForm amount={amount} email={email} file={file} name={name} />
        </Elements>
      </Modal>
    </div>
  );
}
