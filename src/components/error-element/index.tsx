import React from "react";
import "./styles.scss"

export default function ErrorElement() {
    return (
        <div className="error-message-content">
            <h1>Упс!</h1>
            <p className="large-text">Кажется, страница, на которую вы попытались перенаправиться - несуществует.</p>
            <p>Не унывайте - купите пиво.</p>
        </div>
    )
}