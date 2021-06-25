import { useHistory, useParams } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";

import { Button } from "../components/Button";
import { Question } from "../components/Question";
import Modal from 'react-modal';
import { RoomCode } from "../components/RoomCode";

import { useRoom } from "../hooks/useRoom";
// import { useAuth } from "../hooks/useAuth";

import "../styles/room.scss";
import { database } from "../services/firebase";
import { useState } from "react";

type UseParamsType = {
  id: string;
};

export function AdminRoom() {
  const history = useHistory();

  const params = useParams<UseParamsType>();
  const roomId = params.id;
  // const user = useAuth();
  const { title, questions } = useRoom(roomId);

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasEndedRoom, setHasEndedRoom] = useState(false)

  function showModal(){
    setIsModalOpen(true)
  }

  function hideModal(){
    setIsModalOpen(false)
  }

  function handleSetEndRoom(){
    setHasEndedRoom(true)
  }

  async function handleEndRoom() {
    if(!isModalOpen){
      showModal()
    }

    if(isModalOpen && hasEndedRoom){
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      });

      history.push("/");
    }
  }

  Modal.setAppElement('#root')

  async function handleDeleteQuestion(questionId: string) {
    if (
      window.confirm("Tem certeza de que você deseja deletar essa pergunta?")
    ) {
      await database.ref(`/rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleMarkAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined={true} onClick={handleEndRoom}>
              Encerrar sala
            </Button>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={hideModal}
              className="modal"
            >
              <h3>Tem certeza de que você deseja encerrar a sala?</h3>
              <div className="modal-actions">
                <button onClick={hideModal} className="modal-cancel">Cancelar</button>
                <button onClick={() => {handleSetEndRoom(); handleEndRoom()}} className="modal-end">Encerrar sala</button>
              </div>
            </Modal>
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
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >
              {!question.isAnswered && (
                <>
                  <button
                    type="button"
                    onClick={() => handleMarkAsAnswered(question.id)}
                  >
                    <img
                      className="answer"
                      src={checkImg}
                      alt="Marcar como respondida"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHighlightQuestion(question.id)}
                  >
                    <img
                      className="highlight"
                      src={answerImg}
                      alt="Destacar pergunta"
                    />
                  </button>
                </>
              )}
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
