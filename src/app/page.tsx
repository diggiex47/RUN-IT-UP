import "./globals.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <h1 >RUN IT UP</h1>

        <div>
          <Link href="/signup">
          <button className="button">Sign Up</button>
          </Link>
          
          
        </div>

        <div>
          <Link href="/login">
          <button className="button">Login</button>
          </Link>
          
          </div>

    </div>
  )
}
