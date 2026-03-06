import mainLogo from "../assets/mainLogo.png";
import "../styles/authBranding.css";

function authBranding() {
  return (
    <div className="d-none d-md-block">
      {/* Desktop content */}
      <div className="text-center logo-setup" style={{}}>
        {/* TrusonXchanger */}
        <h2 className="fw-bold mb-4 login-text">TrusonXchanger</h2>

        {/* Logo picture */}
        <div
          className="d-flex justify-content-center mb-5"
          style={{ marginTop: "-4rem" }}
        >
          <img
            src={mainLogo} // ← change to your real path
            alt="TrusonXchanger Logo"
            className="img-logo"
            style={{ marginBottom: "5rem" }}
          />
        </div>

        {/* Welcome message */}
        <div
          style={
            {
              /* marginBottom: "6rem"*/
            }
          }
        >
          <p className="mb-0 welcome-message" style={{}}>
            Welcome to the Truson Exchange of Opportunities!
          </p>
          <p className="text-center mt-4 small  welcome-messages" style={{}}>
            Secure • Fast • Global!
          </p>
        </div>
      </div>
    </div>
  );
}

export default authBranding;
