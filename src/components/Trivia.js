import React from "react"
import {nanoid} from "nanoid"

export default function Trivia(props) {
        const answersElement = props.answers.map(ans => {
            return (
                <button
                    key={ans.id} 
                    // className={`answer-button ${ans.id == props.correctAnswer ? "correct-answer" : "incorrect-answer"}`}
                    className={`answer-button ${
                        props.selectedAnswer === ans.id ? "selected-answer" : ""
                    } 
                        ${
                            props.game && props.isCorrect ? "correct-answer" : "" 
                            || props.game && !props.isCorrect ? "incorrect-answer" : ""
                        }
                    `}
                    onClick={() => props.selectAnswer(ans.id, props.id)}
                    >
                    {ans.answer}
                </button>
            )
        })
        
    //    return (
    //         <div className="trivia-page--content" key={eachQ.id}>
    //             <div
    //                 className="question-container"
    //             >
    //                 <h4 className="question-title">{eachQ.question}</h4>
    //                 <div className="question-answers">
    //                     {answersElement}
    //                 </div>
    //                 <hr className="trivia-split-line"/>
    //             </div>
    //         </div>
    //    )
    // })
    
    return (
        <section className="trivia-page">
 
            <div className="trivia-page--content">
                <div
                    className="question-container"
                >
                    <h4 className="question-title">{props.question}</h4>
                    <div className="question-answers">
                        {answersElement}
                    </div>
                    <hr className="trivia-split-line"/>
                </div>
            </div>            
        </section>
    )
    
}