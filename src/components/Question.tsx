import '../styles/question.scss'

type QuestionProps = {
    author: {
        name: string
        avatar: string
    }
    content: string
    children?: React.ReactNode,
    isAnswered?: boolean,
    isHighlighted?: boolean
}

export function Question({ content, author, isAnswered, isHighlighted, children }: QuestionProps){
    return(
        <div className={`question ${isAnswered ? 'answered' : ''} ${isHighlighted && !isAnswered ? 'highlighted' : ''}`}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    )
}