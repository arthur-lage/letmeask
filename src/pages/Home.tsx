import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleLogoImg from "../assets/images/google-icon.svg";

import "../styles/auth.scss";
import { Button } from "../components/Button";

import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";

export function Home() {
  const [roomCode, setRoomCode] = useState("");
  const { user, signInWithGoogle } = useAuth();

  const history = useHistory();

  async function handleJoinRoom(e: FormEvent) {
    e.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert("Room doesn't exist.");
      return;
    }

    if (roomRef.val().endedAt){
      alert('Room already ended')
      return
    }

    history.push(`/rooms/${roomCode}`);
  }

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push("/rooms/new");
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração Perguntas e Respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiencia em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleLogoImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">Ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              onChange={(e) => setRoomCode(e.target.value)}
              value={roomCode}
              placeholder="Digite o código da sala"
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
