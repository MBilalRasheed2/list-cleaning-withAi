import Image from "next/image";
import Link from "next/link";

export default function Pricing() {
  return (
    <>
      <div className="flex h-full flex-col">
        <nav className="py-3 border-gray-100">
          <div className="mx-auto flex flex-wrap justify-between items-center  container">
            <Link href="/" className="flex items-center">
              <Image
                src="/logos/favicon.png"
                className="mr-3 h-16 sm:h-12"
                alt="ListClean Logo"
                width={41}
                height={41}
              />
            </Link>
            <div className="w-full md:block md:w-auto">
              <ul className="flex flex-col p-4 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
                <li>
                  <Link
                    href="/"
                    className="block py-2 pr-4 pl-3 md:p-0 rounded md:border-0 text-magnolia text-lg"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/princing"
                    className="block py-2 pr-4 pl-3 md:p-0 rounded md:border-0 text-magnolia/70 text-lg hover:text-magnolia"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex items-center md:order-2">
              <div className="sm:blflexock hidden items-center gap-2 md:flex">
                <Link
                  href="/login"
                  className="text-center font-medium focus:ring-4 focus:outline-none inline-flex items-center justify-center px-4 py-2 text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-lg"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="py-20">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h1 className="mb-2 p-1 text-5xl font-bold  bg-clip-text bg-gradient-to-br from-emerald to-magnolia">
              Pricing
            </h1>
            <p className="text-lg">
              ListClean offers pricing plans for businesses of all sizes. Get
              started today!
            </p>
          </div>
          <div className="isolate mx-auto mt-10 grid max-w-6xl grid-cols-1 justify-items-center gap-6 justify-between lg:grid-cols-4"></div>
        </div>
      </div>
    </>
  );
}
