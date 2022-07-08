import { Anchor, Box } from "grommet"
import Link from "next/link"
import Image from "next/image"
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react"
import styled from "styled-components"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const HoverableImg = styled.img`
&:hover { cursor: pointer }
`
const JnjHeader = () => {
  const { instance } = useMsal()
  const [checked, setChecked] = useState(false)
  const router = useRouter()
  console.log(`the checked is ${checked}`)
  useEffect(() => {
    console.log(`changing the check ${checked}`)
    setChecked(false)
  }, [router])
  return (
   <nav className="navbar">
     <div className="logo">
     <Link href="/"><img src="jnj-logo.png" alt="jnj-logo" height={30} /></Link>
      
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
 {/* <div className="global-header">
      <Box gap="medium" direction="row">
        <Link href="/">
          <HoverableImg src="jnj-logo.png" alt="jnj-logo" height={30} />
        </Link>
        <Link href="/cellars">
          <a>Our Wines</a>
        </Link>
        <Anchor label="About Us" href="#" />
      </Box>
      <div>
        <UnauthenticatedTemplate>
          <Anchor
            label="Login"
            href="#"
            onClick={() => instance.loginRedirect()}
          />
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          <Box gap="medium" direction="row">
            <Link href="/add">
              <a>Add Wine</a>
            </Link>
            <Anchor
              label="Logout"
              href="#"
              onClick={() => instance.logoutRedirect()}
            />
          </Box>
        </AuthenticatedTemplate>
      </div>
    </div> */}
export default JnjHeader
