import toast from "react-hot-toast";
import { Toaster } from 'react-hot-toast'
import copyImg from "../assets/images/copy.svg";

import "../styles/room-code.scss";

type RoomCodeProps = {
  code: string;
};

export function RoomCode(props: RoomCodeProps) {
  function copyRoomCode() {
    navigator.clipboard.writeText(props.code);
    toast.success("Código copiado com sucesso!")
  }

  return (
    <>
      <Toaster />
      <button onClick={copyRoomCode} className="room-code">
        <div>
          <img src={copyImg} alt="Copiar codigo" />
        </div>
        <span>Sala #{props.code}</span>
      </button>
    </>
  );
}
