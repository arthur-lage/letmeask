import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";

import '../styles/auth.scss'
import { Button } from "../components/Button";

import { FormEvent, useState } from "react";

import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import toast from "react-hot-toast";

export function NewRoom() {
    const { user } = useAuth()

    const history = useHistory()

    const [newRoom, setNewRoom] = useState('')

    async function handleCreateRoom(e: FormEvent){
      e.preventDefault()

      if(newRoom.trim() === '') {
        toast.error("Por favor, utilize um nome de sala válido!")
        return
      }

      const roomRef = database.ref('rooms')
      const firebaseRoom = await roomRef.push({
        title: newRoom,
        authorId: user?.id
      })

      history.push(`/admin/rooms/${firebaseRoom.key}`)
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
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input type="text" placeholder="Nome da sala" onChange={(e) => setNewRoom(e.target.value)} />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
        </div>
      </main>
    </div>
  );
}
