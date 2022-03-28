import Link from 'next/link'
import React from 'react'

const Header = () => {
  //Link will prefetch the page, like static rendering
  //Emnet abbreaviations div>h3*3 --> will create a div with 3 h3 for you
  return (
    <header className="flex justify-between max-w-7xl p-5 mx-auto">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <img
            className="w-64 cursor-pointer object-contain"
            src="https://links.papareact.com/yvf"
            alt=""
          />
        </Link>
        <div className="hidden items-center space-x-5 md:inline-flex">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="rounded-full bg-green-600 px-4 py-1 text-white">
            Follow
          </h3>
        </div>
      </div>
      <div className="flex items-center space-x-5 text-green-600">
        <h3>Sign In</h3>
        <h3 className="rounded-full border border-green-600 px-4 py-1">
          Get Started
        </h3>
      </div>
    </header>
  )
}

export default Header
