import React, { useState } from "react"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import axios from "axios"
import Failed from "../../public/images/failed-icon.svg"
import Image from "next/image"
import { StripeCardElement } from "@stripe/stripe-js"
import { useToast } from "../utils/toastContext"

interface PaymentFormProps {
  amount: number
  email: string
  file: File
  name: string
}

const PaymentForm: React.FC<PaymentFormProps> = (props: PaymentFormProps) => {
  const { amount, email, file, name } = props
  const [success, setSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const stripe = useStripe()!
  const elements = useElements()!
  const { showToast } = useToast()

  const CARD_OPTIONS = {
    hidePostalCode: true,
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    const response = await axios.post(
      `/api/payment-process`,
      {
        amount,
        currency: "usd",
        email,
        name,
      }
    )
    const { paymentIntentId } = response.data
    if (response.data.clientSecret) {
      const clientSecret = response.data.clientSecret
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement) as StripeCardElement,
        },
      })
      if (paymentResult.error) {
        console.error(paymentResult.error)
        setShowError(true)
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        setSuccess(true)
        try {
          const formData = {
            name,
            email,
            file,
            paymentIntentId,
          }
          await axios.post(
            `/api/file-submit`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          showToast("Soon sanitized file will be sent to your email")
        } catch (error) {
          console.log("error", error)
        }
      }
    } else {
      setShowError(true)
    }

    setIsSubmitting(false)
  }

  return (
    <>
      {success ? (
        <div>
          <svg
            viewBox="0 0 24 24"
            className="text-green-600 w-16 h-16 mx-auto my-6"
          >
            <path
              fill="currentColor"
              d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
            ></path>
          </svg>
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
            Payment Done!
          </h3>
          <p className="text-gray-600 my-2 text-center">
            You will be receiving the cleaned list in your email inbox within 12
            hours!
          </p>
        </div>
      ) : (
        !showError && (
          <form
            className="flex flex-col items-center"
            onSubmit={handleSubmit}
          >
            <CardElement options={CARD_OPTIONS} />
            <button
              disabled={!stripe || isSubmitting}
              type="submit"
              className="mt-4 text-white content-center bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {isSubmitting ? "Processing..." : "MAKE PAYMENT"}
            </button>
          </form>
        )
      )}
      {showError && (
        <div
          className="text-red-700 px-4 py-3 rounded relative text-center"
          role="alert"
        >
          <Image
            className="m-auto"
            priority
            src={Failed}
            alt="Cancel"
          />
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
            Transaction failed!
          </h3>
          <p className="text-gray-600 my-2 text-center">
            Please check your card information and try again.
          </p>
          <button
            onClick={() => setShowError(false)}
            className="text-white content-center bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Go Back
          </button>
        </div>
      )}
    </>
  )
}

export default PaymentForm
