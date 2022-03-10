import React from "react"
import Trivia from "./components/Trivia"
import {nanoid} from "nanoid"


export default function App() {
    
    // aka 'Trivia', when user checks answers of quiz
    const [gamesPlayed, setGamesPlayed] = React.useState(1)
    const [game, setGame] = React.useState(false)
    const [triviaData, setTriviaData] = React.useState([])
    const [newQuestions, setNewQuestions] = React.useState([])
    const [selectedAnswer, setSelectedAnswer] = React.useState("")
    
    console.log("next render")
    
    function convert(escapeCharacters) {
        return escapeCharacters
            .replace(/(&quot;)|(&#039;)/g,"'")
            .replace(/(&lt;)/g, "<")
            .replace(/(&gt;)/g, ">")
    }

    React.useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&category=18&difficulty=medium&type=multiple")
            .then(res => res.json())
            .then(data => data.results)
            .then(data => data.map(each => {
                return {
                    question: each.question
                        .replace(/(&quot;)|(&#039;)/g,"'"),
                    correct_answer: {
                        answer: convert(each.correct_answer),
                        id: nanoid()
                        },  
                    incorrect_answers: each.incorrect_answers.map(ans => {
                        ans = convert(ans)
                        return {
                            answer: ans,
                            id: nanoid()
                        }
                    }),
                } 
            }))
            .then(cleanedData => setTriviaData(cleanedData))
        console.log("first effect")
    }, [gamesPlayed])
    
  
    
    // function getAnswerData(answer) {
    //     return (  
    //         {
    //             ...answer,
    //             isSelected: false,
    //         }
    //     )
    // }
    
    function getTriviaData() {
        
        const newTrivData = []
        triviaData.map(data => {
        const answersData = shuffle(data.incorrect_answers, data.correct_answer)
            const newQuestionData = {
                id: nanoid(),
                question: data.question,
                answers: answersData, //array of objects
                correctAnswer: data.correct_answer.id,
                selectedAnswer: selectedAnswer,
                isCorrect: false
            } 
            return newTrivData.push(newQuestionData)

        })
        setNewQuestions(newTrivData)
    }
    
   const triviaElements = newQuestions.length > 0 ? 
    newQuestions.map(data => {
        return (
            <Trivia 
                question={data.question}
                key={data.id}
                id={data.id}
                answers={data.answers}
                correctAnswer={data.correctAnswer}
                isCorrect={data.isCorrect}
                selectAnswer={selectAnswer}
                selectedAnswer={data.selectedAnswer}
                game={game}
            />
        )
    }) : "none"

    
        
    function shuffle(incorrectAnswers, correctAnswer) {
        const answers = incorrectAnswers.concat(correctAnswer)
        for (let i = answers.length - 1; i > 0 - 1; i--) {
            const randIndex = Math.floor(Math.random() * (i + 1))
            const temp = answers[i]
            answers[i] = answers[randIndex]
            answers[randIndex] = temp
        }
        return answers
    }    
    
    function selectAnswer(answerId, questionId) {
        if (game) {
            return
        }
        setNewQuestions(prevQuestions => prevQuestions.map(prevQues => {
            if (prevQues.id === questionId && prevQues.selectedAnswer === answerId) {
                return {...prevQues, selectedAnswer: ""}
            } else if (prevQues.id === questionId) {
                return {...prevQues, selectedAnswer: answerId}
            } else {
                return prevQues
            }
        }))
        
        
        // setNewAnswers(prevAnswers => prevAnswers.map(prevAns => prevAns.map(eachAns => {
        //     return eachAns.id == answerId
        //     ? {...eachAns, isSelected: !eachAns.isSelected}
        //     : eachAns
        // })))
    }
    
    function checkAnswers() {
        if (!game) {
            setNewQuestions(prevQuestions => prevQuestions.map(question => {
                return question.selectedAnswer === question.correctAnswer ?
                {...question, isCorrect: true}
                : question
            }))
            setGame(true)
            
        } else {
            setGame(false)
            setNewQuestions([])
            setGamesPlayed(prevGames => prevGames + 1)
        }
    }
        
    
    return (
        <main className="all-pages">
        {
            !newQuestions.length > 0?
            <div className="startpage">
                <h1 className="startpage--header">Quizzical</h1>
                <p className="startpage--description">Some description if needed</p>
                <button className="start-button" onClick={() => getTriviaData()}>
                    Start Quiz
                </button>
            </div>
            :
            <div className="trivia-page-container">
                 {triviaElements}
                <div className="trivia-page--button">
                    <button className="check-answers-button" onClick={() => checkAnswers()}>
                        {!game ? "Check answers" : "Play again"}
                    </button>
                </div>

            </div>  
        }
        </main>
    )
}