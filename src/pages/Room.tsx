import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

import "../styles/room.scss";

type FirebaseQuestions = Record<string, {
    author: {
        name: string
        avatar: string
    }
    content: string
    isAnswered: boolean
    isHighlighted: boolean
}>

type UseParamsType = {
  id: string;
};

type QuestionsType = {
    author: {
        name: string
        avatar: string
    }
    content: string
    isAnswered: boolean
    isHighlighted: boolean
}

export function Room() {
  const params = useParams<UseParamsType>();
  const roomId = params.id;
  const user = useAuth();

  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState<QuestionsType[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)

    
    roomRef.on('value', room => {
        const databaseRoom = room.val()
        const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

        const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
            return {
                id: key,
                content: value.content,
                author: value.author,
                isAnswered: value.isAnswered,
                isHighlighted: value.isHighlighted
            }
        })

        setTitle(databaseRoom.title)
        setQuestions(parsedQuestions)
    })
  }, [roomId])

  async function handleCreateNewQuestion(e: FormEvent) {
    e.preventDefault()

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("Você precisar fazer login para fazer perguntas!");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.user?.name,
        avatar: user.user?.avatar,
      },
      isHighlightted: false,
      isAnswered: false
    };

    await database.ref(`rooms/${roomId}/questions`).push(question)

    setNewQuestion('')
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <form onSubmit={handleCreateNewQuestion}>
          <textarea
            onChange={(e) => setNewQuestion(e.target.value)}
            value={newQuestion}
            placeholder="O que você quer perguntar?"
          />

          <div className="form-footer">
            {!user ? (
                <span>
                Para enviar uma pergunta, <button>faça seu login</button>
              </span>
            ) : (
                <div className="user-info">
                    <img src={user.user?.avatar} alt="Avatar" />
                    <span>{user.user?.name}</span>
                </div>
            )}
            <Button disabled={!user} type="submit">Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
