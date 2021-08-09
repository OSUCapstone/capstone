import { useRef } from "react";
import { useOutsideAlerter } from "../hooks";

const Modal = ({ children, setOpen }) => {
  let modalRef = useRef(null);

  useOutsideAlerter(modalRef, () => setOpen(false));

  return (
    <div
      ref={modalRef}
      className="z-50"
      style={{
        position: "absolute",
        left: "50%",
        top: "35%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="flex flex-col justify-center items-center w-68 h-40 bg-white border border-gray-100 rounded-md shadow-md p-5">
        {children}
      </div>
    </div>
  );
};

export default Modal;
