import Login from "./Login";

export default function Navbar() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "20px 20px",
          width: "100%",
        }}
      >
        <Login /> 
      </div>
    </>
  );
}
