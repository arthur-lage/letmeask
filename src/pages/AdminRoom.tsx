import { useHistory, useParams } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";

import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";

import { useRoom } from "../hooks/useRoom";
// import { useAuth } from "../hooks/useAuth";

import "../styles/room.scss";
import { database } from "../services/firebase";

type UseParamsType = {
  id: string;
};

export function AdminRoom() {
  const history = useHistory()
  
  const params = useParams<UseParamsType>();
  const roomId = params.id;
  // const user = useAuth();
  const { title, questions } = useRoom(roomId);

  async function handleEndRoom(){
    if(window.confirm("Tem certeza de que você deseja encerrar a sala?")){
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date()
      })
    }

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if (
      window.confirm("Tem certeza de que você deseja deletar essa pergunta?")
    ) {
      await database.ref(`/rooms/${roomId}/questions/${questionId}`).remove();
    }
  }


  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined={true} onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
            >
              <button
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Remover pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
