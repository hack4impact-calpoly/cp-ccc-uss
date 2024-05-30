import Login from "./Login";
import logo from "public/images/logo.png";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 20px",
        width: "100%",
      }}
    >
      <div style={{ flex: 1 }}></div> {/* Spacer to push logo to center */}

      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Link href="/">
          <div style={{ width: "20vw", maxWidth: "150px", marginTop: "20px" }}>
            <Image
              src={logo}
              alt="Logo"
              layout="responsive"
              width={150}
              height={150}
            />
          </div>
        </Link>
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        <Login />
      </div>
    </div>
  );
}
