import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import { apiUrl} from "../../assets/util/api";

const EmailVerificationDialog = ({ visible, onHide, userEmail }) => {
  const [email, setEmail] = useState(userEmail);
  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState("");

  useEffect(() => {
    setEmail(userEmail); // Sync email prop to local state
  }, [userEmail]);

  const handleResend = async () => {
  setLoading(true);
  setResultMsg("");

  try {
    const res = await fetch(
      `${apiUrl}/users/resendVerifyEmailLink`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setResultMsg("Verification email sent. Please check your inbox.");
    } else {
      // Handle expected backend error structure
      const errMsg = data.message || data?.errors?.[0]?.message || "Something went wrong.";
      setResultMsg(errMsg);
    }
  } catch (err) {
    console.error("Error sending verification email:", err);
    setResultMsg("Failed to send request. Check your network.");
  } finally {
    setLoading(false);
  }
};


  return (
    <Dialog
      header="Email Not Verified"
      visible={visible}
      style={{ width: "90vw", maxWidth: "400px" }}
      onHide={onHide}
      closable={!loading}
    >
      <p className="pt-4">
        Your email has not been verified. Would you like to resend the
        verification link?
      </p>

      <div className="mt-3">
        <label htmlFor="email" className="block mb-1 font-medium">
          Email Address
        </label>
        <InputText
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="w-full"
        />
      </div>

      {resultMsg && (
        <small
          className={`block mt-3 ${
            resultMsg.includes("sent") ? "flex justify-between  items-center bg-green-200 p-2 rounded-md text-green-600" : "flex justify-between  items-center bg-red-200 p-2 rounded-md text-red-600"
          }`}
        >
          {resultMsg}
        </small>
      )}

      <div className="w-full pt-4">
        <Button
          label="Resend Email"
          icon="pi pi-send"
          onClick={handleResend}
          loading={loading}
          className="w-full h-10"
        />
      </div>
    </Dialog>
  );
};

EmailVerificationDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
};

export default EmailVerificationDialog;
