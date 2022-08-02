import { Anchor } from "grommet"
import Link from "next/link"
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react"
import styled from "styled-components"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import JnjLogo from "../shared/JnjLogo"

const JnjHeader = () => {
  const { instance } = useMsal()
  const [checked, setChecked] = useState(false)
  const router = useRouter()
  useEffect(() => {
    setChecked(false)
  }, [router])
  return (
   <nav className="navbar">
     <div className="logo">
     <Link href="/"><JnjLogo width={30} /></Link>
      
    </div>
     <ul className="nav-links">
       <input type="checkbox" id="checkbox_toggle" checked={checked} onChange={e => setChecked(e.target.checked)} />
       <label htmlFor="checkbox_toggle" className="hamburger">&#9776;</label>
       <div className="menu">
         <li><Link href="/cellars">Our Wines</Link></li>
         <li><Link href="/aboutus">About Us</Link></li>
         <UnauthenticatedTemplate>
          <li>
            <Anchor
              label="Login"
              href="#"
              onClick={() => instance.loginRedirect()}
            />
          </li>
          
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
        <li><Link href="/add">
              Add Wine
            </Link></li>
            <li><Anchor
              label="Logout"
              href="#"
              onClick={() => instance.logoutRedirect()}
            /></li>
        </AuthenticatedTemplate>
       </div>
     </ul>
   </nav>
   
  )
}

export default JnjHeader
