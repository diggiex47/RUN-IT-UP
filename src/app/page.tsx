// import "./globals.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen justify-center items-center bg-red-200 flex flex-col">
      <h1  >RUN IT UP</h1>

        <div className="bg-blue-200">
          <Link href="/signup">
          <button className="button">Sign Up</button>
          </Link>
          
          
        </div>

        <div className="bg-yellow-200">
          <Link href="/login">
          <button className="button">Login</button>
          </Link>
          
          </div>

    </div>
  )
}
