"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Form from "../components/form"

export default function Home() {
  const [showModal, setShowModal] = useState(false)

  const handleModal = () => {
    setShowModal(!showModal)
  }

  return (
    <>
      <div className="flex h-full flex-col container-wrapper">
        <nav className="md:py-3 border-gray-100 px-4 py-1">
          <div className="mx-auto flex justify-between items-center container">
            <Link
              href="/"
              className="flex items-center w-24"
            >
              <Image
                src="/images/logo.svg"
                alt="ListClean Logo"
                layout="responsive"
                width={349}
                height={255}
              />
            </Link>
          </div>
        </nav>

        <div className="w-full flex-grow px-2 sm:px-4">
          <div className="container mx-auto">
            <div className="mt-16 flex flex-col items-center gap-4">
              <h1 className="md:display w-full font-bold px-4 text-center md:w-[802px] md:px-0 sm:w-[601px] sm:px-0 text-8xl text-transparent bg-clip-text bg-gradient-to-br from-lightblue to-emerald">
                Humanize Your Lead Lists
              </h1>
              <p className="text-2xl px-4 text-center md:w-[572px] md:px-0 sm:w-[601px] sm:px-0">
                Clean the Company Names on your lead lists.
                <br />
                Turn &quot;ListClean Inc. &quot; into &quot; ListClean &quot;
                for all your leads using AI.
              </p>
            </div>

            <div className="mb-10 mt-10 flex flex-col items-center gap-4">
              <p className="body">
                Get your{" "}
                <span className="font-semibold">free account today</span>
              </p>
              <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
                <button
                  className="listCleanBtn text-center font-medium focus:ring-4 focus:outline-none inline-flex items-center justify-center px-5 py-3 text-base text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-lg text-xl bg-gradient-to-br from-emerald to-lightblue text-dark"
                  onClick={handleModal}
                >
                  Get Started
                </button>
              </div>
            </div>
            <div className="mx-auto max-w-4xl px-6 lg:px-8 mb-2">
              <div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8   gap-y-12 sm:max-w-xl sm:grid-cols-4 sm:gap-x-10 sm:gap-y-14 lg:mx-0   lg:max-w-none lg:grid-cols-4">
                <Image
                  className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                  src="/images/scryptgen-logo.png"
                  alt="ScryptGen"
                  width="158"
                  height="48"
                />
                <Image
                  className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                  src="/images/outboundgen-logo.png"
                  alt="OutboundGen"
                  width="158"
                  height="48"
                />
                <Image
                  className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                  src="/images/leadbird-logo.png"
                  alt="Leadbird"
                  width="158"
                  height="48"
                />
                <Image
                  className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
                  src="/images/reflow-logo.svg"
                  alt="Reflow"
                  width="158"
                  height="48"
                />
              </div>

              <video
                controls
                className="w-8/12 mx-auto rounded-lg mt-10"
              >
                <source
                  src="https://www.youtube.com/watch?v=g9KoLtojByY&pp=ygUIbGlsIGJhYnk%3D"
                  type="video/mp4"
                />
                <source
                  src="https://www.youtube.com/watch?v=g9KoLtojByY&pp=ygUIbGlsIGJhYnk%3D"
                  type="video/mp4"
                />
                Sorry, your browser doesn &apos; t support videos.
              </video>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-9/12 mx-auto my-20">
                <div className="col-span-1">
                  <p className="text-2xl font-bold tracking-tight mb-4  text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-blue-500">
                    Clean Your Company Names to Personalize Your Outreach Better
                  </p>
                  <p className="text-md text-magnolia/50">
                    When sending outbound outreach, it&apos;s important to
                    humanize your outreach as much as possible, to make it seem
                    like the message was crafted specifically for each prospect.
                    In a real conversation, no one refers to their company or
                    business with its full legal name. We automatically humanize
                    your lead lists so you can get better responses.
                  </p>
                </div>
                <Image
                  src="/images/listclean-results.svg"
                  alt="ListClean Results"
                  width="158"
                  height="48"
                  className="col-span-1 rounded-lg sm:block"
                />
              </div>
            </div>
          </div>
        </div>

        <footer className="bg-transparent p-8">
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2023
            <Link
              href="/"
              className="hover:underline"
            >
              ListClean
            </Link>
            All Rights Reserved.
          </span>
        </footer>
      </div>
      <Form
        handleCloseModal={handleModal}
        showModal={showModal}
      />
    </>
  )
}
